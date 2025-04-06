
import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface AppearanceTabProps {
  user: any;
}

const AppearanceTab = ({ user }: AppearanceTabProps) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load the user's theme preference
  useEffect(() => {
    // Check if we have a stored preference in the user profile
    const userTheme = user?.theme_preference || 'light';
    
    // Check if we already have a theme in localStorage
    const storedTheme = localStorage.getItem('theme');
    
    // If we have a theme in localStorage or user profile, use it
    if (storedTheme === 'dark' || userTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, [user]);

  const toggleTheme = async () => {
    setIsLoading(true);
    try {
      const newTheme = isDarkMode ? 'light' : 'dark';
      
      // Toggle the dark mode state
      setIsDarkMode(!isDarkMode);
      
      // Apply the theme to the document
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Save to localStorage
      localStorage.setItem('theme', newTheme);
      
      // If user is logged in, save preference to profile
      if (user?.id) {
        const { error } = await supabase
          .from('profiles')
          .update({ theme_preference: newTheme })
          .eq('id', user.id);
          
        if (error) throw error;
      }
      
      toast({
        title: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode activated`,
        description: `Your theme preference has been updated.`,
      });
      
    } catch (error: any) {
      console.error("Error updating theme preference:", error);
      toast({
        variant: "destructive",
        title: "Failed to update theme",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize how ReConnect looks to you.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-row items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <Label htmlFor="theme-toggle" className="text-base font-medium">
                {isDarkMode ? "Dark" : "Light"} Mode
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Switch between light and dark themes.
            </p>
          </div>
          <Switch
            id="theme-toggle"
            checked={isDarkMode}
            onCheckedChange={toggleTheme}
            disabled={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceTab;
