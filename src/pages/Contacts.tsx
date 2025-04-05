
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Users, MessageSquare, UserPlus } from "lucide-react";
import { contactsService } from "@/lib/mockServices";
import { Contact } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const contactsData = await contactsService.getContacts();
        setContacts(contactsData);
        setFilteredContacts(contactsData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        toast({
          title: "Error loading contacts",
          description: "Could not load your contacts. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    loadContacts();
  }, [toast]);
  
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredContacts(contacts);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredContacts(
        contacts.filter(contact => 
          contact.name.toLowerCase().includes(query) ||
          contact.phoneNumber.includes(query)
        )
      );
    }
  }, [searchQuery, contacts]);
  
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await contactsService.syncContacts();
      // In a real app, this would refresh the contact list with new synced contacts
      setIsSyncing(false);
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Could not sync contacts. Please try again.",
        variant: "destructive",
      });
      setIsSyncing(false);
    }
  };
  
  const appUsers = filteredContacts.filter(contact => contact.isAppUser);
  const nonAppUsers = filteredContacts.filter(contact => !contact.isAppUser);
  
  return (
    <div className="reconnect-container py-6">
      <div className="flex justify-between items-center">
        <h1 className="page-header mb-0">Contacts</h1>
        <Button 
          onClick={handleSync} 
          disabled={isSyncing} 
          className="flex items-center space-x-1"
        >
          <UserPlus size={16} className="mr-1" />
          {isSyncing ? "Syncing..." : "Sync Contacts"}
        </Button>
      </div>
      
      <Card className="mt-6 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Your Contacts</CardTitle>
              <CardDescription>
                {filteredContacts.length} contacts, {appUsers.length} on ReConnect
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/contacts/trusted">
                <Users size={14} className="mr-1" />
                Trusted Circles
              </Link>
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {isLoading ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Loading contacts...</p>
            </div>
          ) : (
            <Tabs defaultValue="app-users">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="app-users">
                  On ReConnect ({appUsers.length})
                </TabsTrigger>
                <TabsTrigger value="non-app-users">
                  Not on ReConnect ({nonAppUsers.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="app-users" className="space-y-4">
                {appUsers.length === 0 && (
                  <div className="h-40 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">No matching contacts found</p>
                  </div>
                )}
                
                {appUsers.map(contact => (
                  <div key={contact.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={contact.avatarUrl} />
                        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.phoneNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {contact.isTrusted && (
                        <Badge variant="outline" className="text-xs">Trusted</Badge>
                      )}
                      <Button size="sm" variant="ghost" asChild>
                        <Link to={`/chat/${contact.userId}`}>
                          <MessageSquare size={14} className="mr-1" />
                          Chat
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="non-app-users" className="space-y-4">
                {nonAppUsers.length === 0 && (
                  <div className="h-40 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">No matching contacts found</p>
                  </div>
                )}
                
                {nonAppUsers.map(contact => (
                  <div key={contact.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.phoneNumber}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Plus size={14} className="mr-1" />
                      Invite
                    </Button>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Contacts;
