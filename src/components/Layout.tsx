
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const Layout: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error getting session:", error.message);
        toast({
          title: "Authentication Error",
          description: "Please sign in again.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }
      
      if (!session) {
        // No session, redirect to auth
        navigate("/auth");
        setLoading(false);
        return;
      }
      
      try {
        // Get profile data
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
          
        if (profileError) throw profileError;
        
        setUser({
          ...session.user,
          ...profile
        });
      } catch (error: any) {
        console.error("Error loading user profile:", error.message);
      } finally {
        setLoading(false);
      }
    };
    
    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT") {
          setUser(null);
          navigate("/auth");
        } else if (session && (event === "SIGNED_IN" || event === "TOKEN_REFRESHED")) {
          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();
              
            setUser({
              ...session.user,
              ...profile
            });
          } catch (error: any) {
            console.error("Error loading user profile:", error.message);
          }
        }
      }
    );
    
    getSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header userAvatar={user.avatar_url} userName={user.name} />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
