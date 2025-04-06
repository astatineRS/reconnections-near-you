
import React from "react";
import { AlertCircle, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface SecurityTabProps {
  user: any;
}

const SecurityTab = ({ user }: SecurityTabProps) => {
  const navigate = useNavigate();

  const handlePasswordReset = async () => {
    try {
      if (!user?.email) {
        throw new Error("No email found for the current user");
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for a password reset link.",
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: error.message,
      });
      console.error("Error sending password reset:", error);
    }
  };
  
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      
      navigate("/auth");
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
      console.error("Error signing out:", error);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Security</CardTitle>
        <CardDescription>Manage your account security settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Change Password</h3>
          <p className="text-sm text-muted-foreground mb-4">
            We'll send a password reset link to your email address
          </p>
          <Button onClick={handlePasswordReset} variant="outline" className="w-full">
            <Lock className="h-4 w-4 mr-2" />
            Send Password Reset Email
          </Button>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add an extra layer of security to your account
          </p>
          <Button variant="outline" disabled className="w-full">
            Set Up Two-Factor Authentication
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            (Coming soon)
          </p>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-2">Sign Out</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Sign out from your current session
          </p>
          <Button onClick={handleSignOut} variant="destructive" className="w-full">
            Sign Out
          </Button>
        </div>
        
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Danger Zone</AlertTitle>
          <AlertDescription>
            <p className="mb-4">These actions are irreversible. Please proceed with caution.</p>
            <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive/10">
              Deactivate Account
            </Button>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default SecurityTab;
