/**
 * Types for Plan Your Own Trip PWA
 */

export interface Place {
  id: string;
  name: string;
  expectedCost: number;
  actualCost: number;
  expectedTime: string; // duration, e.g. "3h" or "1.5h"
  actualTime: string; // duration, e.g. "2h" or "1h"
  date: string;
  notes?: string;
  completed: boolean;
}

export interface Activity {
  id: string;
  name: string;
  expectedCost: number;
  actualCost: number;
  expectedTime: string;
  actualTime: string;
  date: string;
  location?: string;
  notes?: string;
  completed: boolean;
}

export interface Transport {
  id: string;
  type: 'Flight' | 'Train' | 'Car' | 'Bus' | 'Ferry' | 'Walking' | 'Other';
  provider: string; // airline, train company, rental co, etc.
  details: string; // flight number, route, departure details
  expectedCost: number;
  actualCost: number;
  expectedTime: string; // expected duration
  actualTime: string; // actual duration
  completed: boolean;
}

export interface DiningItem {
  id: string;
  name: string;
  cuisine?: string;
  expectedCost: number;
  actualCost: number;
  expectedTime: string;
  actualTime: string;
  notes?: string;
  completed: boolean;
}

export interface TravelDocument {
  id: string;
  title: string;
  type: 'boarding_pass' | 'hotel' | 'ticket' | 'visa' | 'other';
  confCode?: string;
  notes?: string;
  fileData?: string; // Base64 data-url to view offline!
  fileName?: string;
  createdAt: string;
}

export interface Trip {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  budget: number;
  coverImage?: string;
  currency?: string;
  ownerId: string;
  ownerEmail: string;
  ownerName?: string;
  collaborators: string[]; // array of emails
  createdAt: string;
  updatedAt: string;
  
  places: Place[];
  activities: Activity[];
  transport: Transport[];
  dining: DiningItem[];
  documents: TravelDocument[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isAnonymous?: boolean;
}
