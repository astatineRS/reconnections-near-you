
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Home, LogOut, Menu, MessageCircle, PlusSquare, Search, User, Users } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  
  useEffect(() => {
    // Get user email when component mounts
    const fetchUserEmail = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email) {
        setUserEmail(data.user.email);
      }
    };
    
    fetchUserEmail();
  }, []);
  
  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Contacts", path: "/contacts", icon: Users },
    { name: "Status", path: "/status", icon: PlusSquare },
    { name: "Help", path: "/help", icon: MessageCircle },
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
  
  // Mobile navigation component
  const MobileNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-10 px-2 pb-1 pt-2">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const ItemIcon = item.icon;
          
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center justify-center ${isActive ? 'text-primary' : 'text-gray-500'}`}
            >
              <div className={`p-1.5 rounded-full ${isActive ? 'bg-primary/10' : ''} transition-all duration-300 ease-in-out`}>
                <ItemIcon size={20} className={isActive ? 'animate-scale-in' : ''} />
              </div>
              <span className="text-[10px] mt-1">{item.name}</span>
            </Link>
          );
        })}
        
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center text-gray-500"
        >
          <Avatar className="h-[28px] w-[28px] border border-primary/20">
            <AvatarImage src={userAvatar} />
            <AvatarFallback>{userName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <span className="text-[10px] mt-1">Profile</span>
        </button>
      </div>
    </nav>
  );
  
  return (
    <>
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="reconnect-container flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl md:text-2xl font-extrabold">
              <Link to="/" className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Re<span className="text-primary">Connect</span>
              </Link>
            </h1>
            
            {!isMobile && (
              <div className="relative max-w-md w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2">
            {!isMobile ? (
              <>
                <nav className="flex space-x-1 md:space-x-2 mr-2">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const ItemIcon = item.icon;
                    
                    return (
                      <Link key={item.path} to={item.path}>
                        <Button 
                          variant={isActive ? "default" : "ghost"}
                          size="sm"
                          className={`flex items-center space-x-1.5 ${isActive ? 'animate-scale-in' : ''}`}
                        >
                          <ItemIcon size={16} />
                          <span>{item.name}</span>
                        </Button>
                      </Link>
                    );
                  })}
                </nav>
                
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={18} />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                    2
                  </Badge>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-200">
                      <AvatarImage src={userAvatar} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {userName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col">
                        <p className="font-medium">{userName || "User"}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {userEmail}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2 h-4 w-4"
                        >
                          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        <span>Settings</span>
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
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={18} />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                    2
                  </Badge>
                </Button>
                
                <Button variant="ghost" size="icon">
                  <Search size={18} />
                </Button>
                
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu size={18} />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[85%] sm:max-w-md">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center space-x-2 mb-8 pt-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={userAvatar} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {userName?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{userName || "User"}</h3>
                          <p className="text-xs text-muted-foreground">View Profile</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-1">
                        <Link to="/profile" className="flex items-center space-x-2 px-2 py-3 rounded-md hover:bg-accent">
                          <User size={16} />
                          <span>Profile</span>
                        </Link>
                        <Link to="/settings" className="flex items-center space-x-2 px-2 py-3 rounded-md hover:bg-accent">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          <span>Settings</span>
                        </Link>
                      </div>
                      
                      <div className="mt-auto pt-4 border-t">
                        <Button 
                          variant="ghost" 
                          className="w-full flex items-center justify-start text-red-500"
                          onClick={handleSignOut}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Sign out</span>
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Mobile bottom navigation bar, Instagram-like */}
      {isMobile && <MobileNav />}
    </>
  );
};

export default Header;
