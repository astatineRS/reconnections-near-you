
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Users, MessageSquare, Bell, BellOff, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { contactsService, locationService, helpBoardService } from "@/lib/mockServices";
import { Contact, HelpRequest } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard: React.FC = () => {
  const [nearbyContacts, setNearbyContacts] = useState<Contact[]>([]);
  const [isLoadingNearby, setIsLoadingNearby] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [recentHelp, setRecentHelp] = useState<HelpRequest[]>([]);
  const [isLoadingHelp, setIsLoadingHelp] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingNearby(true);
        setIsLoadingHelp(true);
        
        const nearbyData = await contactsService.getNearbyContacts();
        setNearbyContacts(nearbyData);
        setIsLoadingNearby(false);
        
        const helpData = await helpBoardService.getHelpRequests();
        setRecentHelp(helpData.slice(0, 3));
        setIsLoadingHelp(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error loading data",
          description: "Could not load dashboard data. Please try again later.",
          variant: "destructive",
        });
      }
    };
    
    fetchData();
  }, [toast]);
  
  const toggleLocationVisibility = async () => {
    try {
      await locationService.toggleLocationVisibility(locationEnabled ? 'none' : 'contacts');
      setLocationEnabled(!locationEnabled);
    } catch (error) {
      toast({
        title: "Error updating visibility",
        description: "Could not update location visibility",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="reconnect-container py-6">
      <h1 className="page-header">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center text-lg">
                <span>Nearby Contacts</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleLocationVisibility}
                  className="text-xs"
                >
                  {locationEnabled ? (
                    <>
                      <Bell size={14} className="mr-1" />
                      <span>Visible</span>
                    </>
                  ) : (
                    <>
                      <BellOff size={14} className="mr-1" />
                      <span>Hidden</span>
                    </>
                  )}
                </Button>
              </CardTitle>
              <CardDescription>Contacts near your current location</CardDescription>
            </CardHeader>
            
            <CardContent>
              {isLoadingNearby ? (
                <div className="h-20 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Loading nearby contacts...</p>
                </div>
              ) : nearbyContacts.length > 0 ? (
                <div className="space-y-4">
                  {nearbyContacts.map(contact => (
                    <div key={contact.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={contact.avatarUrl} />
                          <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin size={12} className="mr-1" />
                            <span>Nearby • New York</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" asChild>
                        <Link to={`/chat/${contact.userId}`}>
                          <MessageSquare size={14} className="mr-1" />
                          Connect
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-20 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">No contacts nearby right now</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between">
                <span>Recent Help Requests</span>
                <Button variant="ghost" size="sm" className="text-xs" asChild>
                  <Link to="/help">View All</Link>
                </Button>
              </CardTitle>
              <CardDescription>Help requests from your contacts</CardDescription>
            </CardHeader>
            
            <CardContent>
              {isLoadingHelp ? (
                <div className="h-20 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Loading help requests...</p>
                </div>
              ) : recentHelp.length > 0 ? (
                <div className="space-y-4">
                  {recentHelp.map(help => (
                    <div key={help.id} className="p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={help.userAvatar} />
                            <AvatarFallback>{help.userName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="text-sm">
                            <p className="font-medium">{help.userName}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(help.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">{help.category}</Badge>
                      </div>
                      
                      <div className="mt-2">
                        <h4 className="font-medium text-sm">{help.title}</h4>
                        <p className="text-xs mt-1 line-clamp-2 text-muted-foreground">
                          {help.description}
                        </p>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-xs text-muted-foreground flex items-center">
                          <MessageSquare size={12} className="mr-1" />
                          {help.responses.length} responses
                        </div>
                        <Button size="sm" variant="ghost" className="h-7 text-xs" asChild>
                          <Link to={`/help/${help.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-20 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">No help requests yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full justify-start" asChild>
                  <Link to="/status/new">
                    <Bell size={16} className="mr-2" />
                    Create Status Update
                  </Link>
                </Button>
                <Button className="w-full justify-start" asChild>
                  <Link to="/help/new">
                    <MessageSquare size={16} className="mr-2" />
                    Post Help Request
                  </Link>
                </Button>
                <Button className="w-full justify-start" asChild>
                  <Link to="/contacts/sync">
                    <Users size={16} className="mr-2" />
                    Sync Contacts
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/settings">
                    <Settings size={16} className="mr-2" />
                    Settings
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Activity</CardTitle>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="new">
                <TabsList className="grid grid-cols-2 mb-2">
                  <TabsTrigger value="new">New Contacts</TabsTrigger>
                  <TabsTrigger value="activity">Recent</TabsTrigger>
                </TabsList>
                
                <TabsContent value="new" className="space-y-3">
                  <div className="flex items-center space-x-3 py-2">
                    <Avatar>
                      <AvatarImage src="https://i.pravatar.cc/150?img=3" />
                      <AvatarFallback>TR</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Taylor Reed</p>
                      <p className="text-xs text-muted-foreground">Joined ReConnect</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 py-2">
                    <Avatar>
                      <AvatarImage src="https://i.pravatar.cc/150?img=4" />
                      <AvatarFallback>CM</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Casey Morgan</p>
                      <p className="text-xs text-muted-foreground">Joined ReConnect</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="activity" className="space-y-3">
                  <div className="flex items-center space-x-3 py-2">
                    <Avatar>
                      <AvatarImage src="https://i.pravatar.cc/150?img=6" />
                      <AvatarFallback>RJ</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Riley Johnson</p>
                      <p className="text-xs text-muted-foreground">Posted a status update</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 py-2">
                    <Avatar>
                      <AvatarImage src="https://i.pravatar.cc/150?img=2" />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Jamie Smith</p>
                      <p className="text-xs text-muted-foreground">Posted a help request</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
