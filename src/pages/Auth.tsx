
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/lib/mockServices";
import { useToast } from "@/components/ui/use-toast";

const Auth: React.FC = () => {
  const [step, setStep] = useState<"phone" | "verification">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmitPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate sending verification code
    setTimeout(() => {
      setIsLoading(false);
      setStep("verification");
      toast({
        title: "Verification code sent",
        description: "Use code 123456 to log in (for demo)",
      });
    }, 1500);
  };
  
  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode) {
      toast({
        title: "Verification code required",
        description: "Please enter the verification code",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await authService.login(phoneNumber, verificationCode);
      navigate("/");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your verification code. Use 123456 for this demo.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-reconnect-blue/20 p-4">
      <div className="w-full max-w-md">
        {step === "phone" ? (
          <Card className="border-none shadow-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-1">Welcome to <span className="text-primary font-bold">ReConnect</span></CardTitle>
              <CardDescription>Enter your phone number to get started</CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmitPhone}>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+1 234 567 890" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending Code..." : "Continue"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <Card className="border-none shadow-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Verify your number</CardTitle>
              <CardDescription>We sent a code to {phoneNumber}</CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmitVerification}>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Verification Code</Label>
                    <Input 
                      id="code" 
                      type="text" 
                      placeholder="123456" 
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      disabled={isLoading}
                      autoFocus
                    />
                    <p className="text-xs text-muted-foreground mt-1">For demo, use code: 123456</p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify & Login"}
                </Button>
                
                <Button 
                  type="button" 
                  variant="link" 
                  size="sm" 
                  onClick={() => setStep("phone")}
                  disabled={isLoading}
                >
                  Back to phone number
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Auth;
