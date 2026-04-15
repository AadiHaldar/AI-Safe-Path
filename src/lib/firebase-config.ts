/**
 * Firebase Configuration and Initialization
 * Handles real-time unsafe area reporting and synchronization
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, onSnapshot, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: any;
let db: any;
let auth: any;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export interface UnsafeAreaReport {
  id?: string;
  lat: number;
  lng: number;
  description: string;
  timestamp: Timestamp;
  upvotes: number;
  userId: string;
}

/**
 * Report an unsafe area
 */
export async function reportUnsafeArea(
  lat: number,
  lng: number,
  description: string,
  userId: string = 'anonymous'
): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, 'unsafe_areas'), {
      lat,
      lng,
      description,
      timestamp: Timestamp.now(),
      upvotes: 0,
      userId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });
    return docRef.id;
  } catch (error) {
    console.error('Error reporting unsafe area:', error);
    return null;
  }
}

/**
 * Subscribe to unsafe area reports in real-time
 */
export function subscribeToUnsafeAreas(
  callback: (areas: UnsafeAreaReport[]) => void
): (() => void) | null {
  try {
    const q = query(collection(db, 'unsafe_areas'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const areas: UnsafeAreaReport[] = [];
      snapshot.forEach((doc) => {
        areas.push({
          id: doc.id,
          ...doc.data(),
        } as UnsafeAreaReport);
      });
      callback(areas);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to unsafe areas:', error);
    return null;
  }
}

/**
 * Upvote an unsafe area report
 */
export async function upvoteUnsafeArea(reportId: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'unsafe_areas', reportId);
    const snapshot = await getFirestore().collection('unsafe_areas').doc(reportId).get();
    
    if (snapshot.exists()) {
      const currentUpvotes = snapshot.data().upvotes || 0;
      await docRef.update({
        upvotes: currentUpvotes + 1,
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error upvoting unsafe area:', error);
    return false;
  }
}

/**
 * Delete an unsafe area report (admin only)
 */
export async function deleteUnsafeArea(reportId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'unsafe_areas', reportId));
    return true;
  } catch (error) {
    console.error('Error deleting unsafe area:', error);
    return false;
  }
}

/**
 * Get unsafe areas within a radius
 */
export async function getUnsafeAreasNearby(
  lat: number,
  lng: number,
  radiusKm: number = 5
): Promise<UnsafeAreaReport[]> {
  try {
    const q = query(collection(db, 'unsafe_areas'));
    const snapshot = await getFirestore().collection('unsafe_areas').get();
    
    const areas: UnsafeAreaReport[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const distance = calculateDistance(lat, lng, data.lat, data.lng);
      
      if (distance <= radiusKm) {
        areas.push({
          id: doc.id,
          ...data,
        } as UnsafeAreaReport);
      }
    });

    return areas.sort((a, b) => b.upvotes - a.upvotes);
  } catch (error) {
    console.error('Error getting nearby unsafe areas:', error);
    return [];
  }
}

/**
 * Calculate distance between two coordinates (km)
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export { db, auth, app };
