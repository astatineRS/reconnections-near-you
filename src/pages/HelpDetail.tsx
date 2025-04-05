
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, ArrowLeft } from "lucide-react";
import { helpBoardService } from "@/lib/mockServices";
import { HelpRequest } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { helpRequests } from "@/lib/mockData";

const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
  switch (category) {
    case "housing":
      return <Badge variant="outline">Housing</Badge>;
    case "recommendations":
      return <Badge variant="secondary">Recommendations</Badge>;
    case "items":
      return <Badge variant="default">Items</Badge>;
    case "jobs":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Jobs</Badge>;
    default:
      return <Badge variant="outline">Other</Badge>;
  }
};

const HelpDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [helpRequest, setHelpRequest] = useState<HelpRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [responseContent, setResponseContent] = useState("");
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchHelpRequest = async () => {
      try {
        // In a real app, we would fetch the specific help request by ID
        setIsLoading(true);
        
        // For demo purposes, using mock data
        const request = helpRequests.find(req => req.id === id);
        if (request) {
          setHelpRequest(request);
        } else {
          toast({
            title: "Help request not found",
            description: "The requested help request could not be found.",
            variant: "destructive",
          });
          navigate("/help");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching help request:", error);
        toast({
          title: "Error loading help request",
          description: "Could not load help request details. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchHelpRequest();
    }
  }, [id, navigate, toast]);
  
  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!responseContent.trim()) {
      toast({
        title: "Response required",
        description: "Please enter a response",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmittingResponse(true);
    
    try {
      if (helpRequest) {
        const newResponse = await helpBoardService.respondToHelpRequest(helpRequest.id, responseContent);
        setHelpRequest({
          ...helpRequest,
          responses: [...helpRequest.responses, newResponse]
        });
        setResponseContent("");
      }
      setIsSubmittingResponse(false);
    } catch (error) {
      console.error("Error submitting response:", error);
      toast({
        title: "Error submitting response",
        description: "Could not submit your response. Please try again.",
        variant: "destructive",
      });
      setIsSubmittingResponse(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="reconnect-container py-6">
        <div className="h-40 flex items-center justify-center">
          <p className="text-muted-foreground">Loading help request...</p>
        </div>
      </div>
    );
  }
  
  if (!helpRequest) {
    return (
      <div className="reconnect-container py-6">
        <div className="text-center my-12">
          <h3 className="text-lg font-medium mb-2">Help request not found</h3>
          <p className="text-muted-foreground mb-4">The help request you're looking for doesn't exist or has been removed</p>
          <Button asChild>
            <Link to="/help">Back to Help Board</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="reconnect-container py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-2" onClick={() => navigate("/help")}>
          <ArrowLeft size={16} className="mr-1" />
          Back
        </Button>
        <h1 className="page-header mb-0">Help Request</h1>
      </div>
      
      <Card className="shadow-sm mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={helpRequest.userAvatar} />
                <AvatarFallback>{helpRequest.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{helpRequest.title}</CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-xs text-muted-foreground">
                    {helpRequest.userName}
                  </p>
                  <CategoryBadge category={helpRequest.category} />
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="mb-4">{helpRequest.description}</p>
          
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            {helpRequest.location && (
              <div className="flex items-center">
                <MapPin size={14} className="mr-1" />
                {helpRequest.location}
              </div>
            )}
            
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              Posted on {new Date(helpRequest.createdAt).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-4">
          Responses ({helpRequest.responses.length})
        </h2>
        
        {helpRequest.responses.length > 0 ? (
          <div className="space-y-4">
            {helpRequest.responses.map(response => (
              <Card key={response.id} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={response.userAvatar} />
                      <AvatarFallback>{response.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{response.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(response.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm">{response.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-sm bg-muted/30">
            <CardContent className="p-4 text-center">
              <p className="text-muted-foreground">No responses yet. Be the first to respond!</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Add Your Response</CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmitResponse}>
            <Textarea
              placeholder="Share your answer, recommendation, or offer to help..."
              value={responseContent}
              onChange={(e) => setResponseContent(e.target.value)}
              rows={4}
              className="mb-4"
              disabled={isSubmittingResponse}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmittingResponse}>
                {isSubmittingResponse ? "Submitting..." : "Submit Response"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpDetail;
