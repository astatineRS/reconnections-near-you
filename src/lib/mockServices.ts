
import { toast } from "@/components/ui/use-toast";
import { contacts, statusCards, helpRequests, nearbyContacts, currentUser } from "./mockData";
import { Contact, StatusCard, HelpRequest, HelpResponse, User } from "./types";

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth service
export const authService = {
  login: async (phoneNumber: string, verificationCode: string): Promise<User | null> => {
    await delay(1000);
    if (phoneNumber && verificationCode === '123456') {
      return currentUser;
    }
    throw new Error('Invalid credentials');
  },
  
  logout: async (): Promise<void> => {
    await delay(500);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out"
    });
  },
  
  getCurrentUser: async (): Promise<User> => {
    await delay(500);
    return currentUser;
  }
};

// Contacts service
export const contactsService = {
  getContacts: async (): Promise<Contact[]> => {
    await delay(800);
    return contacts;
  },
  
  syncContacts: async (): Promise<{ added: number }> => {
    await delay(1500);
    toast({
      title: "Contacts synced",
      description: "3 new contacts found on ReConnect"
    });
    return { added: 3 };
  },
  
  getNearbyContacts: async (): Promise<Contact[]> => {
    await delay(1000);
    return nearbyContacts;
  }
};

// Status cards service
export const statusService = {
  getStatusCards: async (): Promise<StatusCard[]> => {
    await delay(800);
    return statusCards;
  },
  
  createStatusCard: async (content: string, location?: string, visibility?: 'everyone' | 'contacts' | 'trusted', expiresInDays?: number): Promise<StatusCard> => {
    await delay(1000);
    
    const newCard: StatusCard = {
      id: `status${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatarUrl,
      content,
      location,
      visibility: visibility || 'contacts',
      createdAt: new Date(),
      expiresAt: expiresInDays ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000) : undefined
    };
    
    toast({
      title: "Status posted",
      description: "Your status has been shared"
    });
    
    return newCard;
  }
};

// Help board service
export const helpBoardService = {
  getHelpRequests: async (): Promise<HelpRequest[]> => {
    await delay(800);
    return helpRequests;
  },
  
  createHelpRequest: async (title: string, description: string, category: 'housing' | 'recommendations' | 'items' | 'jobs' | 'other', location?: string): Promise<HelpRequest> => {
    await delay(1000);
    
    const newHelpRequest: HelpRequest = {
      id: `help${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatarUrl,
      title,
      description,
      category,
      location,
      createdAt: new Date(),
      responses: []
    };
    
    toast({
      title: "Help request posted",
      description: "Your request has been shared with your contacts"
    });
    
    return newHelpRequest;
  },
  
  respondToHelpRequest: async (helpRequestId: string, content: string): Promise<HelpResponse> => {
    await delay(800);
    
    const newResponse: HelpResponse = {
      id: `resp${Date.now()}`,
      helpRequestId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatarUrl,
      content,
      createdAt: new Date()
    };
    
    toast({
      title: "Response sent",
      description: "Your response has been added to the request"
    });
    
    return newResponse;
  }
};

// Location service
export const locationService = {
  updateLocation: async (latitude: number, longitude: number): Promise<void> => {
    await delay(800);
    // In a real app this would update the user's location
    toast({
      title: "Location updated",
      description: "Your location has been updated"
    });
  },
  
  getLocationPermission: async (): Promise<boolean> => {
    await delay(500);
    return true; // Simulate user giving permission
  },
  
  toggleLocationVisibility: async (visibility: 'everyone' | 'contacts' | 'none'): Promise<void> => {
    await delay(500);
    toast({
      title: "Visibility updated",
      description: `Your location is now visible to ${visibility}`
    });
  }
};
