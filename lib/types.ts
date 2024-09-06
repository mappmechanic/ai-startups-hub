import { Timestamp, DocumentReference } from 'firebase/firestore';

export interface IStartup {
    id?: string;
    name: string;
    description: string;
    category: string;
    foundedAt: string;
    foundingStage: string;
    logo: string;
    color: string;
    location: string;
    logoUrl: string;
    phoneNumber: string;
    websiteUrl: string;
    jobListings: string[] | DocumentReference[];
    hqAddress: string;
    rating: number;
    numberOfRatings: number;
    approved: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface IJob {
    id?: string;
    startupId: DocumentReference; // ID of the startup document
    position: string;
    location: string; // e.g., 'Remote', 'Vancouver'
    employmentType: string; // e.g., 'Full-time', 'Part-time', etc.
    description: string;
    applyUrl: string;
    createdAt: Timestamp; // Automatically set with serverTimestamp
    updatedAt: Timestamp; // Automatically set with serverTimestamp
}