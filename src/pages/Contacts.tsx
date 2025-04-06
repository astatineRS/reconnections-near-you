
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pulse } from '@/components/ui/pulse';
import { MapPin, MessageSquare, Phone, Plus, Search, Star, StarOff, User, Video } from 'lucide-react';

// Mock data for contacts
const mockContacts = [
  {
    id: '1',
    name: 'Emma Johnson',
    avatar: null,
    online: true,
    trusted: true,
    location: 'San Francisco, CA',
    distance: '0.5 miles away',
    lastSeen: 'Now',
    phone: '+1 (555) 123-4567',
    email: 'emma.j@example.com',
  },
  {
    id: '2',
    name: 'James Wilson',
    avatar: null,
    online: true,
    trusted: true,
    location: 'San Francisco, CA',
    distance: '1.2 miles away',
    lastSeen: 'Now',
    phone: '+1 (555) 987-6543',
    email: 'james.w@example.com',
  },
  {
    id: '3',
    name: 'Sophia Chen',
    avatar: null,
    online: false,
    trusted: false,
    location: 'Oakland, CA',
    distance: '5.5 miles away',
    lastSeen: '2h ago',
    phone: '+1 (555) 456-7890',
    email: 'sophia.c@example.com',
  },
  {
    id: '4',
    name: 'Michael Rodriguez',
    avatar: null,
    online: false,
    trusted: true,
    location: 'San Jose, CA',
    distance: '12.3 miles away',
    lastSeen: '1d ago',
    phone: '+1 (555) 234-5678',
    email: 'michael.r@example.com',
  },
  {
    id: '5',
    name: 'Olivia Park',
    avatar: null,
    online: false,
    trusted: false,
    location: 'Berkeley, CA',
    distance: '8.7 miles away',
    lastSeen: '3d ago',
    phone: '+1 (555) 876-5432',
    email: 'olivia.p@example.com',
  },
  {
    id: '6',
    name: 'Ethan Thompson',
    avatar: null,
    online: false,
    trusted: false,
    location: 'Palo Alto, CA',
    distance: '15.1 miles away',
    lastSeen: '1w ago',
    phone: '+1 (555) 345-6789',
    email: 'ethan.t@example.com',
  },
];

const ContactCard = ({ contact }: { contact: any }) => {
  const [isTrusted, setIsTrusted] = useState(contact.trusted);
  
  return (
    <Card className="hover:shadow-md transition-all duration-300 glass-card border-none animate-scale-in">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={contact.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {contact.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {contact.online && (
                <div className="absolute bottom-0 right-0">
                  <Pulse color="green" />
                </div>
              )}
            </div>
            
            <div>
              <div className="flex items-center">
                <h3 className="font-medium">{contact.name}</h3>
                {isTrusted && (
                  <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200 text-[10px] py-0">
                    Trusted
                  </Badge>
                )}
              </div>
              <div className="flex items-center mt-1">
                <MapPin className="h-3 w-3 text-muted-foreground mr-1" />
                <p className="text-xs text-muted-foreground">{contact.distance}</p>
              </div>
              <p className="text-xs mt-0.5">
                {contact.online ? (
                  <span className="text-emerald-600 font-medium">● Online</span>
                ) : (
                  <span className="text-gray-500">Last seen {contact.lastSeen}</span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <div className="flex space-x-1">
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-primary/5 hover:bg-primary/10">
                <MessageSquare className="h-4 w-4 text-primary" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-primary/5 hover:bg-primary/10">
                <Phone className="h-4 w-4 text-primary" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-primary/5 hover:bg-primary/10">
                <Video className="h-4 w-4 text-primary" />
              </Button>
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-7 text-xs"
              onClick={() => setIsTrusted(!isTrusted)}
            >
              {isTrusted ? (
                <>
                  <StarOff className="h-3.5 w-3.5 mr-1 text-amber-500" /> Untrust
                </>
              ) : (
                <>
                  <Star className="h-3.5 w-3.5 mr-1 text-muted-foreground" /> Trust
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Contacts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const onlineContacts = mockContacts.filter(contact => contact.online);
  const offlineContacts = mockContacts.filter(contact => !contact.online);
  
  const filteredOnlineContacts = onlineContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredOfflineContacts = offlineContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="reconnect-container py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold">Contacts</h1>
          
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                className="pl-9 pr-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button>
              <Plus className="h-4 w-4 mr-1" /> Add Contact
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="online">Online ({onlineContacts.length})</TabsTrigger>
            <TabsTrigger value="trusted">Trusted</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6 animate-fade-in">
            {filteredOnlineContacts.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-medium text-muted-foreground">Online ({filteredOnlineContacts.length})</h2>
                <div className="grid gap-3">
                  {filteredOnlineContacts.map(contact => (
                    <ContactCard key={contact.id} contact={contact} />
                  ))}
                </div>
              </div>
            )}
            
            {filteredOfflineContacts.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-medium text-muted-foreground">Offline ({filteredOfflineContacts.length})</h2>
                <div className="grid gap-3">
                  {filteredOfflineContacts.map(contact => (
                    <ContactCard key={contact.id} contact={contact} />
                  ))}
                </div>
              </div>
            )}
            
            {filteredOnlineContacts.length === 0 && filteredOfflineContacts.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <User className="h-12 w-12 mb-3 text-gray-400" />
                <h3 className="text-lg font-medium">No contacts found</h3>
                <p className="text-muted-foreground mt-1 max-w-md">
                  We couldn't find any contacts matching your search. Try a different search term or add new contacts.
                </p>
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-1" /> Add New Contact
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="online" className="animate-fade-in">
            {filteredOnlineContacts.length > 0 ? (
              <div className="grid gap-3">
                {filteredOnlineContacts.map(contact => (
                  <ContactCard key={contact.id} contact={contact} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <User className="h-12 w-12 mb-3 text-gray-400" />
                <h3 className="text-lg font-medium">No online contacts</h3>
                <p className="text-muted-foreground mt-1">
                  None of your contacts are currently online.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="trusted" className="animate-fade-in">
            {mockContacts.filter(c => c.trusted && c.name.toLowerCase().includes(searchTerm.toLowerCase())).length > 0 ? (
              <div className="grid gap-3">
                {mockContacts
                  .filter(c => c.trusted && c.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(contact => (
                    <ContactCard key={contact.id} contact={contact} />
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Star className="h-12 w-12 mb-3 text-gray-400" />
                <h3 className="text-lg font-medium">No trusted contacts</h3>
                <p className="text-muted-foreground mt-1 max-w-md">
                  Mark contacts as trusted to add them to your trusted circle.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Contacts;
