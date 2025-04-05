
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  userAvatar?: string;
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ userAvatar, userName }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Contacts", path: "/contacts" },
    { name: "Status Updates", path: "/status" },
    { name: "Help Board", path: "/help" },
  ];
  
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
              
              <Avatar className="cursor-pointer">
                <AvatarImage src={userAvatar} />
                <AvatarFallback>{userName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
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
