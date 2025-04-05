
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Plus } from "lucide-react";
import { statusService } from "@/lib/mockServices";
import { StatusCard } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const StatusBadge: React.FC<{ visibility: string }> = ({ visibility }) => {
  switch (visibility) {
    case "everyone":
      return <Badge variant="default">Public</Badge>;
    case "contacts":
      return <Badge variant="outline">Contacts</Badge>;
    case "trusted":
      return <Badge variant="secondary">Trusted Only</Badge>;
    default:
      return null;
  }
};

const Status: React.FC = () => {
  const [statusCards, setStatusCards] = useState<StatusCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchStatusCards = async () => {
      try {
        const cards = await statusService.getStatusCards();
        setStatusCards(cards);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching status cards:", error);
        toast({
          title: "Error loading status updates",
          description: "Could not load status updates. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    fetchStatusCards();
  }, [toast]);
  
  return (
    <div className="reconnect-container py-6">
      <div className="flex justify-between items-center">
        <h1 className="page-header mb-0">Status Updates</h1>
        <Button asChild>
          <Link to="/status/new">
            <Plus size={16} className="mr-1" />
            New Status
          </Link>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="h-40 flex items-center justify-center">
          <p className="text-muted-foreground">Loading status updates...</p>
        </div>
      ) : statusCards.length === 0 ? (
        <div className="my-12 text-center">
          <h3 className="text-lg font-medium mb-2">No status updates yet</h3>
          <p className="text-muted-foreground mb-4">Create a status update to let your contacts know what you're up to</p>
          <Button asChild>
            <Link to="/status/new">Create Your First Status</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {statusCards.map(card => (
            <Card key={card.id} className="shadow-sm overflow-hidden card-hover">
              <div className={`h-1 ${card.visibility === 'trusted' ? 'bg-secondary' : card.visibility === 'everyone' ? 'bg-primary' : 'bg-accent'}`}></div>
              <CardHeader className="pb-2 flex flex-row justify-between items-start">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={card.userAvatar} />
                    <AvatarFallback>{card.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{card.userName}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock size={12} className="mr-1" />
                        <span>{formatTimeAgo(card.createdAt)}</span>
                      </div>
                      <StatusBadge visibility={card.visibility} />
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-base mb-3">{card.content}</p>
                
                {card.location && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin size={14} className="mr-1" /> 
                    <span>{card.location}</span>
                  </div>
                )}
                
                {card.expiresAt && (
                  <div className="mt-3 text-xs flex items-center text-muted-foreground">
                    <Users size={14} className="mr-1" />
                    <span>Active until {new Date(card.expiresAt).toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Status;
