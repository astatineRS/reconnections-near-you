
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MapPin, Clock, Users } from "lucide-react";
import { statusService } from "@/lib/mockServices";
import { useToast } from "@/components/ui/use-toast";

const CreateStatus: React.FC = () => {
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [visibility, setVisibility] = useState<"everyone" | "contacts" | "trusted">("contacts");
  const [hasExpiration, setHasExpiration] = useState(false);
  const [expireDays, setExpireDays] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please enter some content for your status update",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await statusService.createStatusCard(
        content,
        location,
        visibility,
        hasExpiration ? expireDays : undefined
      );
      
      navigate("/status");
    } catch (error) {
      console.error("Error creating status:", error);
      toast({
        title: "Error creating status",
        description: "Could not create your status update. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="reconnect-container py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="page-header">Create Status Update</h1>
        
        <Card className="shadow-sm">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>What's happening?</CardTitle>
              <CardDescription>
                Share an update with your contacts
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="content">Status Update</Label>
                <Textarea 
                  id="content" 
                  placeholder="What would you like to share? (e.g., 'In Chicago for the weekend!')"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  disabled={isSubmitting}
                  className="resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  Location (Optional)
                </Label>
                <Input 
                  id="location" 
                  placeholder="Add a location (e.g., 'San Francisco, CA')"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="visibility" className="flex items-center">
                    <Users size={16} className="mr-2" />
                    Who can see this?
                  </Label>
                  <Select 
                    value={visibility} 
                    onValueChange={(value) => setVisibility(value as any)} 
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="visibility">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contacts">All Contacts</SelectItem>
                      <SelectItem value="trusted">Trusted Contacts Only</SelectItem>
                      <SelectItem value="everyone">Everyone on ReConnect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="expiration" className="flex items-center">
                      <Clock size={16} className="mr-2" />
                      Set Expiration
                    </Label>
                    <Switch 
                      id="expiration" 
                      checked={hasExpiration}
                      onCheckedChange={setHasExpiration}
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  {hasExpiration && (
                    <div className="space-y-2">
                      <Label htmlFor="days">Expires after (days)</Label>
                      <Select 
                        value={expireDays.toString()} 
                        onValueChange={(value) => setExpireDays(parseInt(value))} 
                        disabled={isSubmitting}
                      >
                        <SelectTrigger id="days">
                          <SelectValue placeholder="Select days" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 day</SelectItem>
                          <SelectItem value="3">3 days</SelectItem>
                          <SelectItem value="7">1 week</SelectItem>
                          <SelectItem value="14">2 weeks</SelectItem>
                          <SelectItem value="30">1 month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => navigate("/status")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : "Post Status Update"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateStatus;
