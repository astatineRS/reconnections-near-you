
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

// Notifications form schema
const notificationsFormSchema = z.object({
  status_updates: z.boolean().default(true),
  help_responses: z.boolean().default(true),
  new_contacts: z.boolean().default(true),
  app_updates: z.boolean().default(false),
});

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

const NotificationsTab = () => {
  // Notifications form
  const notificationsForm = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      status_updates: true,
      help_responses: true,
      new_contacts: true,
      app_updates: false,
    },
  });
  
  const onNotificationsSubmit = async (data: NotificationsFormValues) => {
    // In a real app, this would update user notification preferences in the database
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Control what notifications you receive</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...notificationsForm}>
          <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-4">
            <FormField
              control={notificationsForm.control}
              name="status_updates"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Status Updates</FormLabel>
                    <FormDescription>
                      Receive notifications about status updates from your contacts
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Separator />
            
            <FormField
              control={notificationsForm.control}
              name="help_responses"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Help Responses</FormLabel>
                    <FormDescription>
                      Receive notifications when someone responds to your help requests
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Separator />
            
            <FormField
              control={notificationsForm.control}
              name="new_contacts"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">New Contacts</FormLabel>
                    <FormDescription>
                      Receive notifications when someone adds you as a contact
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Separator />
            
            <FormField
              control={notificationsForm.control}
              name="app_updates"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">App Updates</FormLabel>
                    <FormDescription>
                      Receive notifications about new features and updates
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full mt-6">
              Save Notification Settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NotificationsTab;
