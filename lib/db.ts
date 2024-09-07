// lib/db.ts

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  FirestoreDataConverter,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  addDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { IStartup, IJob } from './types';  // Import your TypeScript interfaces

const startupConverter: FirestoreDataConverter<IStartup> = {
  toFirestore: (startup: IStartup) => startup,
  fromFirestore: (snapshot, options) => snapshot.data(options) as IStartup,
};

// Function to fetch all startups from Firestore
export const getAllStartups = async (
  options: {
    recentlyAdded?: boolean;
    topRated?: boolean;
    limitCount?: number;
  } = {}
): Promise<IStartup[]> => {
  try {
    const startupsCollection = collection(db, 'startups').withConverter(startupConverter);
    const constraints: QueryConstraint[] = [
      where('approved', '==', true)  // Add this line to filter approved startups
    ];

    if (options.recentlyAdded) {
      constraints.push(orderBy('createdAt', 'desc'));
    }

    if (options.topRated) {
      constraints.push(orderBy('rating', 'desc'));
    }

    if (options.limitCount) {
      constraints.push(limit(options.limitCount));
    }

    const q = query(startupsCollection, ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as IStartup));
  } catch (error) {
    console.error('Error fetching startups:', error);
    throw error;
  }
};

// Function to get a single startup by ID
export const getStartupById = async (id: string): Promise<IStartup | null> => {
  try {
    const startupRef = doc(db, 'startups', id).withConverter(startupConverter);
    const docSnapshot = await getDoc(startupRef);
    return docSnapshot.exists() ? { id, ...docSnapshot.data() } as IStartup : null;
  } catch (error) {
    console.error(`Error fetching startup with id ${id}:`, error);
    throw error;
  }
};

// Function to add or update a startup
export const addStartup = async (data: Omit<IStartup, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const startupsCollection = collection(db, 'startups').withConverter(startupConverter);
    const docRef = await addDoc(startupsCollection, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding startup:', error);
    throw error;
  }
};

// Function to update an existing startup
export const updateStartup = async (id: string, data: Partial<IStartup>): Promise<void> => {
  try {
    const startupRef = doc(db, 'startups', id).withConverter(startupConverter);
    await updateDoc(startupRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error(`Error updating startup with id ${id}:`, error);
    throw error;
  }
};

// Function to update startup rating
export const updateStartupRating = async (id: string, newRating: number): Promise<void> => {
  try {
    const startupRef = doc(db, 'startups', id).withConverter(startupConverter);
    const startupDoc = await getDoc(startupRef);

    if (!startupDoc.exists()) {
      throw new Error(`Startup with id ${id} not found`);
    }

    const startupData = startupDoc.data();
    const currentRating = startupData.rating || 0;
    const currentNumberOfRatings = startupData.numberOfRatings || 0;

    const newNumberOfRatings = currentNumberOfRatings + 1;
    const newAverageRating = (currentRating * currentNumberOfRatings + newRating) / newNumberOfRatings;

    await updateDoc(startupRef, {
      rating: newAverageRating,
      numberOfRatings: newNumberOfRatings,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error(`Error updating rating for startup with id ${id}:`, error);
    throw error;
  }
};

// Function to get search suggestions
export async function getSearchSuggestions(searchQuery: string): Promise<IStartup[]> {
  const startups = collection(db, 'startups').withConverter(startupConverter);
  const lowercaseQuery = searchQuery.toLowerCase();

  const locationQuery = query(
    startups,
    where('locationLowercase', '>=', lowercaseQuery),
    where('locationLowercase', '<=', lowercaseQuery + '\uf8ff'),
    limit(5)
  );

  const nameQuery = query(
    startups,
    where('nameLowercase', '>=', lowercaseQuery),
    where('nameLowercase', '<=', lowercaseQuery + '\uf8ff'),
    limit(5)
  );

  const [locationResults, nameResults] = await Promise.all([
    getDocs(locationQuery),
    getDocs(nameQuery)
  ]);

  const suggestions: IStartup[] = [];

  const addSuggestion = (doc: any) => {
    const startup = { id: doc.id, ...doc.data() } as IStartup;
    if (!suggestions.some(s => s.id === startup.id)) {
      suggestions.push(startup);
    }
  };

  locationResults.forEach(addSuggestion);
  nameResults.forEach(addSuggestion);

  // If no exact matches, perform a more lenient search
  if (suggestions.length === 0) {
    const allStartups = await getDocs(startups);
    allStartups.forEach(doc => {
      const startup = { id: doc.id, ...doc.data() } as IStartup;
      if (['location', 'name', 'description'].some(field => 
          startup[field as keyof IStartup]?.toString().toLowerCase().includes(lowercaseQuery)
      )) {
        suggestions.push(startup);
      }
    });
  }

  return suggestions.slice(0, 5);
}