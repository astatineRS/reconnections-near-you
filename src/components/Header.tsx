
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, LogOut, Menu, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface HeaderProps {
  userAvatar?: string;
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ userAvatar, userName }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Contacts", path: "/contacts" },
    { name: "Status Updates", path: "/status" },
    { name: "Help Board", path: "/help" },
  ];
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const NavLinks = () => (
    <nav className="flex space-x-1 md:space-x-2">
      {navItems.map((item) => (
        <Link key={item.path} to={item.path}>
          <Button 
            variant={location.pathname === item.path ? "default" : "ghost"} 
            size={isMobile ? "sm" : "default"}
            className={isMobile ? "text-xs px-2.5" : ""}
          >
            {item.name}
          </Button>
        </Link>
      ))}
    </nav>
  );
  
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="reconnect-container flex justify-between items-center h-14">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg md:text-xl font-bold text-reconnect-gray-dark">
            <Link to="/">Re<span className="text-primary">Connect</span></Link>
          </h1>
          {!isMobile && <NavLinks />}
        </div>
        
        <div className="flex items-center space-x-2">
          {isMobile ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={18} />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu size={18} />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col space-y-4 mt-8">
                    <div className="flex items-center space-x-2 mb-6">
                      <Avatar>
                        <AvatarImage src={userAvatar} />
                        <AvatarFallback>{userName?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{userName || "User"}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      {navItems.map((item) => (
                        <Link key={item.path} to={item.path}>
                          <Button 
                            variant={location.pathname === item.path ? "default" : "ghost"} 
                            className="w-full justify-start"
                          >
                            {item.name}
                          </Button>
                        </Link>
                      ))}
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-red-500 mt-4"
                        onClick={handleSignOut}
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={18} />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={userAvatar} />
                    <AvatarFallback>{userName?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium">{userName || "User"}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
      
      {isMobile && (
        <div className="overflow-x-auto scrollbar-none bg-secondary/50">
          <div className="reconnect-container py-2">
            <NavLinks />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
