
import { User, Contact, StatusCard, HelpRequest, HelpResponse } from './types';

// Mock Current User
export const currentUser: User = {
  id: 'user1',
  name: 'Alex Johnson',
  phoneNumber: '+1234567890',
  email: 'alex@example.com',
  avatarUrl: 'https://i.pravatar.cc/150?img=1',
  location: {
    latitude: 40.7128,
    longitude: -74.0060,
    city: 'New York',
    country: 'USA',
    lastUpdated: new Date(),
  },
  visibility: 'contacts',
  isOnline: true,
};

// Mock Contacts
export const contacts: Contact[] = [
  {
    id: 'contact1',
    userId: 'user2',
    name: 'Jamie Smith',
    phoneNumber: '+1234567891',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    isAppUser: true,
    isTrusted: true,
  },
  {
    id: 'contact2',
    userId: 'user3',
    name: 'Taylor Reed',
    phoneNumber: '+1234567892',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    isAppUser: true,
    isTrusted: false,
  },
  {
    id: 'contact3',
    userId: 'user4',
    name: 'Casey Morgan',
    phoneNumber: '+1234567893',
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
    isAppUser: true,
    isTrusted: true,
  },
  {
    id: 'contact4',
    userId: 'user5',
    name: 'Jordan Taylor',
    phoneNumber: '+1234567894',
    isAppUser: false,
    isTrusted: false,
  },
  {
    id: 'contact5',
    userId: 'user6',
    name: 'Riley Johnson',
    phoneNumber: '+1234567895',
    avatarUrl: 'https://i.pravatar.cc/150?img=6',
    isAppUser: true,
    isTrusted: true,
  },
];

// Mock Status Cards
export const statusCards: StatusCard[] = [
  {
    id: 'status1',
    userId: 'user2',
    userName: 'Jamie Smith',
    userAvatar: 'https://i.pravatar.cc/150?img=2',
    content: 'In New York for 3 days! Anyone want to grab coffee?',
    location: 'New York, USA',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Expires in 2 days
    visibility: 'contacts',
  },
  {
    id: 'status2',
    userId: 'user3',
    userName: 'Taylor Reed',
    userAvatar: 'https://i.pravatar.cc/150?img=3',
    content: 'Looking for apartment recommendations in Brooklyn!',
    location: 'Brooklyn, USA',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    visibility: 'everyone',
  },
  {
    id: 'status3',
    userId: 'user6',
    userName: 'Riley Johnson',
    userAvatar: 'https://i.pravatar.cc/150?img=6',
    content: 'Visiting Chicago next week, who\'s around?',
    location: 'Chicago, USA',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
    visibility: 'trusted',
  },
];

// Mock Help Requests
export const helpRequests: HelpRequest[] = [
  {
    id: 'help1',
    userId: 'user3',
    userName: 'Taylor Reed',
    userAvatar: 'https://i.pravatar.cc/150?img=3',
    title: 'Need a Recommendation for Co-Working Space',
    description: 'I\'m looking for a quiet co-working space in Williamsburg. Any recommendations?',
    category: 'recommendations',
    location: 'Brooklyn, USA',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    responses: [
      {
        id: 'resp1',
        helpRequestId: 'help1',
        userId: 'user6',
        userName: 'Riley Johnson',
        userAvatar: 'https://i.pravatar.cc/150?img=6',
        content: 'I recommend WorkHaus on Bedford Ave. They have great coffee too!',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
    ],
  },
  {
    id: 'help2',
    userId: 'user2',
    userName: 'Jamie Smith',
    userAvatar: 'https://i.pravatar.cc/150?img=2',
    title: 'Looking to Borrow a Camera Lens',
    description: 'I need a Sony 24-70mm lens for a shoot this weekend. Can anyone help?',
    category: 'items',
    location: 'New York, USA',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    responses: [],
  },
  {
    id: 'help3',
    userId: 'user4',
    userName: 'Casey Morgan',
    userAvatar: 'https://i.pravatar.cc/150?img=4',
    title: 'Job Opening at My Company',
    description: 'We\'re hiring a React developer. Let me know if you or someone you know is interested!',
    category: 'jobs',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    responses: [
      {
        id: 'resp2',
        helpRequestId: 'help3',
        userId: 'user1',
        userName: 'Alex Johnson',
        userAvatar: 'https://i.pravatar.cc/150?img=1',
        content: 'I might know someone, will DM you the details.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        id: 'resp3',
        helpRequestId: 'help3',
        userId: 'user6',
        userName: 'Riley Johnson',
        userAvatar: 'https://i.pravatar.cc/150?img=6',
        content: 'What\'s the salary range? I have a friend who might be interested.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
    ],
  },
];

// Mock Nearby Contacts (For location feature)
export const nearbyContacts: Contact[] = [
  {
    id: 'contact1',
    userId: 'user2',
    name: 'Jamie Smith',
    phoneNumber: '+1234567891',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    isAppUser: true,
    isTrusted: true,
  }
];
