
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Plus, Search } from "lucide-react";
import { helpBoardService } from "@/lib/mockServices";
import { HelpRequest } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

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

const HelpBoard: React.FC = () => {
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<HelpRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchHelpRequests = async () => {
      try {
        const requests = await helpBoardService.getHelpRequests();
        setHelpRequests(requests);
        setFilteredRequests(requests);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching help requests:", error);
        toast({
          title: "Error loading help requests",
          description: "Could not load help requests. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    fetchHelpRequests();
  }, [toast]);
  
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRequests(helpRequests);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredRequests(
        helpRequests.filter(request => 
          request.title.toLowerCase().includes(query) ||
          request.description.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, helpRequests]);
  
  const requestsWithResponses = filteredRequests.filter(req => req.responses.length > 0);
  const requestsWithoutResponses = filteredRequests.filter(req => req.responses.length === 0);
  
  return (
    <div className="reconnect-container py-6">
      <div className="flex justify-between items-center">
        <h1 className="page-header mb-0">Help Board</h1>
        <Button asChild>
          <Link to="/help/new">
            <Plus size={16} className="mr-1" />
            New Request
          </Link>
        </Button>
      </div>
      
      <Card className="mt-6 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Help Requests</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search help requests..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {isLoading ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-muted-foreground">Loading help requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="my-12 text-center">
              <h3 className="text-lg font-medium mb-2">No help requests found</h3>
              <p className="text-muted-foreground mb-4">Create a new help request to get assistance from your contacts</p>
              <Button asChild>
                <Link to="/help/new">Create Help Request</Link>
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="all">
                  All ({filteredRequests.length})
                </TabsTrigger>
                <TabsTrigger value="needs-help">
                  Needs Help ({requestsWithoutResponses.length})
                </TabsTrigger>
                <TabsTrigger value="with-responses">
                  With Responses ({requestsWithResponses.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                {filteredRequests.map(request => (
                  <Card key={request.id} className="shadow-sm hover:shadow-md transition-all cursor-pointer">
                    <Link to={`/help/${request.id}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={request.userAvatar} />
                              <AvatarFallback>{request.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{request.title}</h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <p className="text-xs text-muted-foreground">
                                  {request.userName} • {formatTimeAgo(request.createdAt)}
                                </p>
                                <CategoryBadge category={request.category} />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MessageSquare size={14} className="mr-1" />
                            {request.responses.length}
                          </div>
                        </div>
                        <p className="mt-3 text-sm line-clamp-2 text-muted-foreground">
                          {request.description}
                        </p>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="needs-help" className="space-y-4">
                {requestsWithoutResponses.length > 0 ? (
                  requestsWithoutResponses.map(request => (
                    <Card key={request.id} className="shadow-sm hover:shadow-md transition-all cursor-pointer">
                      <Link to={`/help/${request.id}`}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarImage src={request.userAvatar} />
                                <AvatarFallback>{request.userName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">{request.title}</h3>
                                <div className="flex items-center space-x-2 mt-1">
                                  <p className="text-xs text-muted-foreground">
                                    {request.userName} • {formatTimeAgo(request.createdAt)}
                                  </p>
                                  <CategoryBadge category={request.category} />
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-100">
                              Needs Help
                            </Badge>
                          </div>
                          <p className="mt-3 text-sm line-clamp-2 text-muted-foreground">
                            {request.description}
                          </p>
                        </CardContent>
                      </Link>
                    </Card>
                  ))
                ) : (
                  <div className="h-40 flex items-center justify-center">
                    <p className="text-muted-foreground">No requests need help right now</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="with-responses" className="space-y-4">
                {requestsWithResponses.length > 0 ? (
                  requestsWithResponses.map(request => (
                    <Card key={request.id} className="shadow-sm hover:shadow-md transition-all cursor-pointer">
                      <Link to={`/help/${request.id}`}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarImage src={request.userAvatar} />
                                <AvatarFallback>{request.userName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">{request.title}</h3>
                                <div className="flex items-center space-x-2 mt-1">
                                  <p className="text-xs text-muted-foreground">
                                    {request.userName} • {formatTimeAgo(request.createdAt)}
                                  </p>
                                  <CategoryBadge category={request.category} />
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <MessageSquare size={14} className="mr-1" />
                              {request.responses.length}
                            </div>
                          </div>
                          <p className="mt-3 text-sm line-clamp-2 text-muted-foreground">
                            {request.description}
                          </p>
                        </CardContent>
                      </Link>
                    </Card>
                  ))
                ) : (
                  <div className="h-40 flex items-center justify-center">
                    <p className="text-muted-foreground">No requests with responses found</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpBoard;
