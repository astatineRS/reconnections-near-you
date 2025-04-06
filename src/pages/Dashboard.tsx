
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, MapPin, MessageSquare, Plus, User, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface StatusUpdateType {
  id: string;
  content: string;
  created_at: string;
  user: {
    name: string;
    avatar_url: string | null;
  };
}

interface HelpRequestType {
  id: string;
  title: string;
  category: string;
  created_at: string;
  user: {
    name: string;
    avatar_url: string | null;
  };
  responses: number;
}

const StatusCard = ({ status }: { status: StatusUpdateType }) => {
  const timeAgo = new Date(status.created_at).toLocaleDateString();
  
  return (
    <Card className="card-hover glass-card animate-scale-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8 border border-primary/10">
              <AvatarImage src={status.user.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">{status.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base font-medium">{status.user.name}</CardTitle>
              <div className="flex items-center mt-0.5">
                <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                <span className="text-xs text-muted-foreground">{timeAgo}</span>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">Status Update</Badge>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-sm">{status.content}</p>
      </CardContent>
      <CardFooter className="pt-2 pb-3 flex justify-between">
        <Button variant="ghost" size="sm" className="text-xs">
          <MessageSquare className="h-3.5 w-3.5 mr-1" /> Reply
        </Button>
      </CardFooter>
    </Card>
  );
};

const HelpCard = ({ helpRequest }: { helpRequest: HelpRequestType }) => {
  const categories: Record<string, { color: string; label: string }> = {
    housing: { color: 'bg-blue-100 text-blue-800', label: 'Housing' },
    recommendations: { color: 'bg-purple-100 text-purple-800', label: 'Recommendations' },
    items: { color: 'bg-amber-100 text-amber-800', label: 'Items' },
    jobs: { color: 'bg-emerald-100 text-emerald-800', label: 'Jobs' },
    other: { color: 'bg-gray-100 text-gray-800', label: 'Other' },
  };
  
  const category = categories[helpRequest.category] || categories.other;
  const timeAgo = new Date(helpRequest.created_at).toLocaleDateString();
  
  return (
    <Card className="card-hover glass-card animate-scale-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8 border border-primary/10">
              <AvatarImage src={helpRequest.user.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">{helpRequest.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base font-medium">{helpRequest.user.name}</CardTitle>
              <div className="flex items-center mt-0.5">
                <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                <span className="text-xs text-muted-foreground">{timeAgo}</span>
              </div>
            </div>
          </div>
          <Badge className={`text-xs ${category.color}`}>{category.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-sm font-medium">{helpRequest.title}</p>
      </CardContent>
      <CardFooter className="pt-2 pb-3 flex justify-between">
        <div className="flex items-center">
          <MessageSquare className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{helpRequest.responses} {helpRequest.responses === 1 ? 'response' : 'responses'}</span>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/help/${helpRequest.id}`} className="text-xs">
            View <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const [userData, setUserData] = useState<any>(null);
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdateType[]>([]);
  const [helpRequests, setHelpRequests] = useState<HelpRequestType[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch current user data
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          setUserData({ ...user, ...profileData });
        }
        
        // For demo purposes, let's create some mock data
        // In a real app, you would fetch this from your Supabase database
        const mockStatusUpdates = [
          {
            id: '1',
            content: 'Just moved to a new apartment in the downtown area. Looking for furniture recommendations!',
            created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
            user: {
              name: 'Sarah Johnson',
              avatar_url: null,
            },
          },
          {
            id: '2',
            content: 'Started my new job at Tech Solutions today. Excited for this new chapter!',
            created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
            user: {
              name: 'Michael Chen',
              avatar_url: null,
            },
          },
          {
            id: '3',
            content: 'Looking for recommendations on good kindergartens in the Westside neighborhood.',
            created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
            user: {
              name: 'Emma Rodriguez',
              avatar_url: null,
            },
          },
        ];
        
        const mockHelpRequests = [
          {
            id: '1',
            title: 'Looking for a reliable moving company',
            category: 'recommendations',
            created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
            user: {
              name: 'David Park',
              avatar_url: null,
            },
            responses: 3,
          },
          {
            id: '2',
            title: 'Need a temporary accommodation for 2 weeks',
            category: 'housing',
            created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
            user: {
              name: 'Lisa Wong',
              avatar_url: null,
            },
            responses: 2,
          },
          {
            id: '3',
            title: 'Job opportunity for a web developer',
            category: 'jobs',
            created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
            user: {
              name: 'Carlos Mendez',
              avatar_url: null,
            },
            responses: 5,
          },
        ];
        
        setStatusUpdates(mockStatusUpdates);
        setHelpRequests(mockHelpRequests);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [toast]);
  
  // Show skeleton loader while data is loading
  if (loading) {
    return (
      <div className="reconnect-container py-8">
        <div className="grid gap-8">
          {/* Skeleton for welcome card */}
          <div className="bg-white h-40 rounded-2xl shimmer"></div>
          
          {/* Skeleton for status updates */}
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-200 rounded shimmer"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white h-32 rounded-2xl shimmer"></div>
              <div className="bg-white h-32 rounded-2xl shimmer"></div>
            </div>
          </div>
          
          {/* Skeleton for help requests */}
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-200 rounded shimmer"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white h-32 rounded-2xl shimmer"></div>
              <div className="bg-white h-32 rounded-2xl shimmer"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="reconnect-container py-8">
      <div className="grid gap-8 animate-reveal">
        {/* Welcome card */}
        <Card className="glass-card bg-gradient-to-r from-blue-50 to-indigo-50 border-none overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-100 rounded-full -translate-y-1/4 translate-x-1/4 opacity-50"></div>
          <CardContent className="p-6 md:p-8 relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome, {userData?.name || 'Friend'}!</h1>
                <p className="mt-2 text-gray-600 max-w-md">Stay connected with your community and discover what's happening around you.</p>
                
                <div className="flex gap-3 mt-4">
                  <Button className="gap-2" asChild>
                    <Link to="/status/new">
                      <Plus size={16} /> Status Update
                    </Link>
                  </Button>
                  <Button variant="outline" className="gap-2" asChild>
                    <Link to="/help/new">
                      <MessageSquare size={16} /> Ask for Help
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-xl shadow-sm">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Users size={18} className="text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
                    <p className="text-xs text-gray-500">Contacts</p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <MapPin size={18} className="text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-1">5</p>
                    <p className="text-xs text-gray-500">Nearby</p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <MessageSquare size={18} className="text-amber-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
                    <p className="text-xs text-gray-500">Messages</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Status Updates Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Recent Status Updates</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/status">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {statusUpdates.slice(0, 2).map(status => (
              <StatusCard key={status.id} status={status} />
            ))}
          </div>
        </div>
        
        {/* Help Requests Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Recent Help Requests</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/help">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {helpRequests.slice(0, 2).map(request => (
              <HelpCard key={request.id} helpRequest={request} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
