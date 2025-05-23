// src/constants/mockActivities.ts
import { Activity } from '../types/activityTypes';

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    title: 'Morning Yoga in the Park',
    description: 'Join us for a refreshing morning yoga session. All levels welcome!',
    imageUrl:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Replace with a real or placeholder image URL
    category: 'Outdoor',
    location: 'Central Park - Great Lawn',
    dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    creatorId: 'user123',
  },
  {
    id: '2',
    title: 'Italian Cooking Class',
    description: 'Learn to make authentic pasta from scratch with Chef Luigi.',
    imageUrl:
      'https://images.unsplash.com/photo-1556909172-6ab63f18fd12?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Replace with a real or placeholder image URL
    category: 'Food',
    location: 'Downtown Culinary School',
    dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    creatorId: 'user456',
  },
  {
    id: '3',
    title: 'Indie Band Showcase',
    description: 'Discover new music from local indie bands. Great vibes guaranteed!',
    imageUrl:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Replace with a real or placeholder image URL
    category: 'Arts',
    location: 'The Underground Venue',
    dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    creatorId: 'user789',
  },
  {
    id: '4',
    title: 'Tech Meetup: AI Trends',
    description: 'Discussion on the latest trends in Artificial Intelligence and Machine Learning.',
    imageUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Replace with a real or placeholder image URL
    category: 'Learning',
    location: 'Innovation Hub Co-working',
    dateTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    creatorId: 'user101',
  },
  {
    id: '5',
    title: 'Weekend Basketball Game',
    description: 'Friendly 5v5 basketball game. Bring your sneakers and A-game!',
    imageUrl:
      'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Replace with a real or placeholder image URL
    category: 'Sports',
    location: 'Community Sports Center',
    dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    creatorId: 'user202',
  },
  {
    id: '6',
    title: 'Board Game Night',
    description: 'Join us for a fun night of board games, snacks, and good company.',
    imageUrl:
      'https://images.unsplash.com/photo-1585255453482-f43191188770?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Replace with a real or placeholder image URL
    category: 'Social',
    location: 'The Corner Cafe',
    dateTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
    creatorId: 'user303',
  },
];
