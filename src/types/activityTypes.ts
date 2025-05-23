// src/types/activityTypes.ts
export interface Activity {
  id: string;
  title: string;
  description: string;
  imageUrl: string; // Can be a remote URL or a local asset reference
  category: 'Outdoor' | 'Social' | 'Food' | 'Learning' | 'Arts' | 'Sports' | 'Other';
  location: string; // Simple text representation for now
  dateTime: string; // ISO 8601 date-time string
  creatorId: string; // Mock ID of the user who created/suggested it
  // Optional fields for future expansion:
  // price?: number;
  // capacity?: number;
  // tags?: string;
}
