import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocFromServer,
  setDoc, 
  deleteDoc, 
  collection, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { Trip, UserProfile } from '../types';

// Detect if config is a mock one or real one
const isMockFirebase = !firebaseConfig.apiKey || firebaseConfig.apiKey.includes('PLACEHOLDER') || firebaseConfig.apiKey === 'MOCK_KEY';

// Initialize Firebase
let app;
let db: any = null;
let auth: any = null;
let googleProvider: any = null;

if (!isMockFirebase) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.error("Failed to initialize Firebase with real config:", error);
  }
}

// Validation function as per SKILL
export function isValidId(id: string): boolean {
  return typeof id === 'string' && id.length <= 128 && /^[a-zA-Z0-9_\-]+$/.test(id);
}

// Error Handler conformant with the Firebase Integration Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || 'offline-mock',
      email: auth?.currentUser?.email || 'offline-mock@gmail.com',
      emailVerified: auth?.currentUser?.emailVerified || true,
      isAnonymous: auth?.currentUser?.isAnonymous || false,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Optional validation of firestore connection
async function testConnection() {
  if (isMockFirebase || !db) return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your Firebase configuration or network status.");
    }
  }
}
testConnection();

// Dual-mode Storage Manager: Firestore when online & available, LocalStorage for full offline usage
// LocalStorage keys:
const STORAGE_PREFIX = 'tripplanner_';
const TRIPS_KEY = `${STORAGE_PREFIX}trips`;
const USER_KEY = `${STORAGE_PREFIX}user`;

// Load fallback offline data from LocalStorage
function getOfflineTrips(): Trip[] {
  try {
    const data = localStorage.getItem(TRIPS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to read offline trips cache:", e);
    return [];
  }
}

function saveOfflineTrips(trips: Trip[]) {
  try {
    localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
  } catch (e) {
    console.error("Failed to write offline trips cache:", e);
  }
}

// Local mock profiles when in offline/mock mode
function getOfflineUser(): UserProfile | null {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

function saveOfflineUser(user: UserProfile | null) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

// DB Core Functions
export const dbService = {
  isMockEnabled(): boolean {
    return isMockFirebase || !db;
  },

  // Auth operations
  async loginWithGoogle(): Promise<UserProfile> {
    if (this.isMockEnabled() || !auth || !googleProvider) {
      // Return beautiful mock user
      const mockUser: UserProfile = {
        uid: 'user_mock_123',
        email: 'titikshadaga19@gmail.com',
        displayName: 'Titiksha Daga',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'
      };
      saveOfflineUser(mockUser);
      return mockUser;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Traveler',
        photoURL: user.photoURL || undefined
      };
      
      // Save profile to users collection
      const pathProfile = `users/${user.uid}/public/profile`;
      try {
        await setDoc(doc(db, 'users', user.uid, 'public', 'profile'), profile);
      } catch (err) {
        // Safe fail-silent or secondary capture if permission lacks
        console.warn("Failed saving profile to Firestore", err);
      }

      saveOfflineUser(profile);
      return profile;
    } catch (err) {
      console.error("Auth popup error", err);
      throw err;
    }
  },

  async logout(): Promise<void> {
    saveOfflineUser(null);
    if (this.isMockEnabled() || !auth) {
      return;
    }
    await signOut(auth);
  },

  subscribeAuth(callback: (user: UserProfile | null) => void) {
    // Check initial local storage
    const offlineUser = getOfflineUser();
    callback(offlineUser);

    if (this.isMockEnabled() || !auth) {
      return () => {};
    }

    return onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'Traveler',
          photoURL: firebaseUser.photoURL || undefined
        };
        saveOfflineUser(profile);
        callback(profile);
      } else {
        saveOfflineUser(null);
        callback(null);
      }
    });
  },

  // Trips CRUD operations
  async getTrips(userEmail: string, userId: string): Promise<Trip[]> {
    const offline = getOfflineTrips();
    
    // Filter local copies that belong to user or are shared
    let filteredTrips = offline.filter(t => 
      t.ownerId === userId || 
      t.ownerEmail === userEmail || 
      t.collaborators.some(c => c.toLowerCase() === userEmail.toLowerCase())
    );

    if (this.isMockEnabled() || !db) {
      // If mock mode is working, and the user has no trips yet, seeding a delightful mock trip to let them test sharing & expected vs actual analytics is perfect!
      if (filteredTrips.length === 0) {
        const seeded: Trip = {
          id: 'swiss-alps-2026',
          title: 'Summer in the Swiss Alps',
          description: 'A breathtaking hiking adventure with friends.',
          startDate: '2026-07-10',
          endDate: '2026-07-18',
          budget: 2500,
          coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop',
          ownerId: userId || 'user_mock_123',
          ownerEmail: userEmail || 'titikshadaga19@gmail.com',
          ownerName: 'Titiksha Daga',
          collaborators: ['amit.shah@gmail.com', 'lisa.traveler@outlook.com'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          places: [
            { id: 'p1', name: 'Zermatt Alpine Village', expectedCost: 200, actualCost: 180, expectedTime: '6h', actualTime: '5.5h', date: '2026-07-11', completed: true, notes: 'Stunning view of the Matterhorn!' },
            { id: 'p2', name: 'Interlaken Lakes', expectedCost: 150, actualCost: 165, expectedTime: '4h', actualTime: '4.5h', date: '2026-07-13', completed: true, notes: 'Took the ferry.' }
          ],
          activities: [
            { id: 'a1', name: 'Paragliding Hike', expectedCost: 180, actualCost: 180, expectedTime: '3h', actualTime: '3h', date: '2026-07-12', completed: true, location: 'Interlaken Meadows' },
            { id: 'a2', name: 'Matterhorn Glacier Palace Ride', expectedCost: 95, actualCost: 95, expectedTime: '2h', actualTime: '2.5h', date: '2026-07-11', completed: false }
          ],
          transport: [
            { id: 't1', type: 'Train', provider: 'SBB Rail', details: 'Zurich Airport to Zermatt direct train', expectedCost: 110, actualCost: 110, expectedTime: '3.5h', actualTime: '3.5h', completed: true },
            { id: 't2', type: 'Car', provider: 'Sixt Car Rental', details: 'Compact AWD Rental', expectedCost: 400, actualCost: 430, expectedTime: '4 days', actualTime: '4 days', completed: false }
          ],
          dining: [
            { id: 'd1', name: 'Walliserkanne', cuisine: 'Traditional Fondue', expectedCost: 80, actualCost: 95, expectedTime: '2h', actualTime: '2.5h', completed: true, notes: 'Ordered extra cheese truffle fondue.' },
            { id: 'd2', name: 'Restaurant spycher', cuisine: 'Swiss Grill', expectedCost: 120, actualCost: 0, expectedTime: '2h', actualTime: '0h', completed: false }
          ],
          documents: [
            { id: 'doc1', title: 'SBB Train SuperSaver Pass', type: 'boarding_pass', confCode: 'CONF-88481A', notes: 'Keep QR code ready.', createdAt: new Date().toISOString() },
            { id: 'doc2', title: 'Matterhorn Swiss Lodge Booking', type: 'hotel', confCode: 'SL-7762X', notes: 'Check-in from 2:00 PM', createdAt: new Date().toISOString() }
          ]
        };
        filteredTrips = [seeded];
        saveOfflineTrips([seeded]);
      }
      return filteredTrips;
    }

    // Try reading from Firestore
    const pathTrips = 'trips';
    try {
      // Query 1: Owner
      const qOwner = query(collection(db, pathTrips), where('ownerId', '==', userId));
      const resOwner = await getDocs(qOwner);
      const listTrips: Trip[] = [];
      resOwner.forEach(d => {
        listTrips.push(d.data() as Trip);
      });

      // Query 2: Collaborator
      const qCollab = query(collection(db, pathTrips), where('collaborators', 'array-contains', userEmail));
      const resCollab = await getDocs(qCollab);
      resCollab.forEach(d => {
        if (!listTrips.some(t => t.id === d.id)) {
          listTrips.push(d.data() as Trip);
        }
      });

      // Merge and save to offline cache
      const oldOffline = getOfflineTrips().filter(t => t.ownerId !== userId);
      const mergedOffline = [...oldOffline, ...listTrips];
      saveOfflineTrips(mergedOffline);

      return listTrips;
    } catch (err) {
      console.warn("Firestore error reading trips, using cache fallback:", err);
      // Fallback to offline filtered cache
      return filteredTrips;
    }
  },

  async saveTrip(trip: Trip): Promise<void> {
    // Update local cache first (guarantees instantaneous latency-free feedback!)
    const offline = getOfflineTrips();
    const idx = offline.findIndex(t => t.id === trip.id);
    if (idx >= 0) {
      offline[idx] = trip;
    } else {
      offline.push(trip);
    }
    saveOfflineTrips(offline);

    if (this.isMockEnabled() || !db) {
      return;
    }

    const pathTripDetail = `trips/${trip.id}`;
    try {
      if (!isValidId(trip.id)) {
        throw new Error("Invalid character in Trip ID: Use alphanumeric and hyphens");
      }
      await setDoc(doc(db, 'trips', trip.id), trip);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, pathTripDetail);
    }
  },

  async deleteTrip(tripId: string): Promise<void> {
    // Delete local cache
    const offline = getOfflineTrips();
    const updated = offline.filter(t => t.id !== tripId);
    saveOfflineTrips(updated);

    if (this.isMockEnabled() || !db) {
      return;
    }

    const pathTripDetail = `trips/${tripId}`;
    try {
      await deleteDoc(doc(db, 'trips', tripId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, pathTripDetail);
    }
  }
};
