
export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  avatarUrl?: string;
  location?: Location;
  visibility: 'everyone' | 'contacts' | 'none';
  lastSeen?: Date;
  isOnline: boolean;
}

export interface Contact {
  id: string;
  userId: string;
  name: string;
  phoneNumber: string;
  email?: string;
  avatarUrl?: string;
  isAppUser: boolean;
  isTrusted: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city: string;
  country: string;
  lastUpdated: Date;
}

export interface StatusCard {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  location?: string;
  expiresAt?: Date;
  createdAt: Date;
  visibility: 'everyone' | 'contacts' | 'trusted';
}

export interface HelpRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  description: string;
  category: 'housing' | 'recommendations' | 'items' | 'jobs' | 'other';
  location?: string;
  createdAt: Date;
  responses: HelpResponse[];
}

export interface HelpResponse {
  id: string;
  helpRequestId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
}

export interface TrustedCircle {
  id: string;
  name: string;
  ownerId: string;
  members: string[]; // User IDs
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}
