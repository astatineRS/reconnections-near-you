
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

// Visibility form schema
const visibilityFormSchema = z.object({
  visibility: z.enum(["everyone", "contacts", "none"], {
    required_error: "Please select a visibility option.",
  }),
});

type VisibilityFormValues = z.infer<typeof visibilityFormSchema>;

interface PrivacyTabProps {
  user: any;
}

const PrivacyTab = ({ user }: PrivacyTabProps) => {
  const [isSaving, setIsSaving] = useState(false);
  
  // Visibility form
  const visibilityForm = useForm<VisibilityFormValues>({
    resolver: zodResolver(visibilityFormSchema),
    defaultValues: {
      visibility: user?.visibility as "everyone" | "contacts" | "none" || "contacts",
    },
  });
  
  const onVisibilitySubmit = async (data: VisibilityFormValues) => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      // Update visibility in database
      const { error } = await supabase
        .from("profiles")
        .update({
          visibility: data.visibility,
        })
        .eq("id", user.id);
        
      if (error) throw error;
      
      toast({
        title: "Privacy settings updated",
        description: "Your privacy settings have been updated successfully.",
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating privacy settings",
        description: error.message,
      });
      console.error("Error updating privacy settings:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Location Privacy</CardTitle>
          <CardDescription>Control who can see your location</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...visibilityForm}>
            <form onSubmit={visibilityForm.handleSubmit(onVisibilitySubmit)} className="space-y-4">
              <FormField
                control={visibilityForm.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Who can see your location and status?</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="contacts">Contacts Only</SelectItem>
                        <SelectItem value="none">No One</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This controls who can see your location, status, and online presence.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Privacy Settings"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Location Sharing</CardTitle>
          <CardDescription>Control your location sharing settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Share precise location</p>
              <p className="text-sm text-muted-foreground">
                Allow the app to access your precise GPS location
              </p>
            </div>
            <Switch defaultChecked={true} />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Location History</p>
              <p className="text-sm text-muted-foreground">
                Save your location history for better recommendations
              </p>
            </div>
            <Switch defaultChecked={false} />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Show city-level location only</p>
              <p className="text-sm text-muted-foreground">
                Only show city information rather than precise location
              </p>
            </div>
            <Switch defaultChecked={true} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyTab;
