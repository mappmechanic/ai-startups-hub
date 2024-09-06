'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAllStartups, updateStartupRating } from '@/lib/db';
import { IStartup } from '@/lib/types';
import Rating from '@/components/Rating';
import { toast } from '@/components/ui/use-toast'; // Adjust this import based on your project structure

export default function StartupsPage() {
  const [startups, setStartups] = useState<IStartup[]>([]);
  const searchParams = useSearchParams();
  const sortBy = searchParams.get('sortBy') || 'recent';

  useEffect(() => {
    const fetchStartups = async () => {
      const startupsData = await getAllStartups({ recentlyAdded: sortBy === 'recent', topRated: sortBy === 'rating' });
      setStartups(startupsData);
    };

    fetchStartups();
  }, [sortBy]);

  const handleRatingChange = async (id: string, newRating: number) => {
    try {
      await updateStartupRating(id, newRating);
      setStartups(prevStartups =>
        prevStartups.map(startup =>
          startup.id === id ? { ...startup, rating: newRating } : startup
        )
      );
      toast({
        title: "Success",
        description: "Rating updated successfully!",
        variant: "success",
      });
    } catch (error) {
      console.error('Error updating rating:', error);
      toast({
        title: "Error",
        description: "Failed to update rating. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">AI Startups</h1>
      <div className="mb-6 text-center">
        Sort by:
        <a href="?sortBy=recent" className="ml-2 text-blue-600 hover:underline">Most Recent</a> |
        <a href="?sortBy=rating" className="ml-2 text-blue-600 hover:underline">Top Rated</a>
      </div>
      <ul className="space-y-6">
        {startups.map(startup => (
          <li key={startup.id} className="bg-white shadow-md rounded-lg p-6 text-left">
            <h2 className="text-2xl font-semibold mb-2">{startup.name}</h2>
            <p className="text-gray-600 mb-2">{startup.description}</p>
            <p className="text-sm text-gray-500 mb-1">
              <strong>Website:</strong> <a href={startup.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{startup.website}</a>
            </p>
            <p className="text-sm text-gray-500 mb-3">
              <strong>Office:</strong> {startup.hqAddress}
            </p>
            <div className="flex justify-between items-center">
              <Rating 
                id={startup.id || ''} 
                initialRating={startup.rating} 
                onRatingChange={(newRating) => handleRatingChange(startup.id || '', newRating)} 
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
