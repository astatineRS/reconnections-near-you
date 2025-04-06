
import React, { useState, useEffect } from "react";
import { User, MapPin, Bell, Shield, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Import tab components
import ProfileTab from "@/components/settings/ProfileTab";
import PrivacyTab from "@/components/settings/PrivacyTab";
import NotificationsTab from "@/components/settings/NotificationsTab";
import SecurityTab from "@/components/settings/SecurityTab";

const Settings = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        // Get the current user
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !authUser) {
          throw new Error(authError?.message || "No authenticated user found");
        }
        
        // Get user profile data
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();
          
        if (profileError) {
          throw profileError;
        }
        
        // Merge auth user and profile data
        const userData = {
          ...authUser,
          ...profile,
        };
        
        setUser(userData);
        
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error loading profile",
          description: error.message,
        });
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="reconnect-container py-8">
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reconnect-container py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <div className="flex overflow-x-auto pb-2 mb-2">
          <TabsList>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="profile" className="space-y-6">
          <ProfileTab user={user} />
        </TabsContent>
        
        <TabsContent value="privacy" className="space-y-6">
          <PrivacyTab user={user} />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <NotificationsTab />
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <SecurityTab user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
