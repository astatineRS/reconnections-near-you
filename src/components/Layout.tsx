
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-2xl font-bold">
                R
              </span>
            </div>
          </div>
          <p className="text-gray-500 animate-pulse">Loading ReConnect...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header userAvatar={user.avatar_url} userName={user.name} />
      <main className="flex-grow pb-16 md:pb-0 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
