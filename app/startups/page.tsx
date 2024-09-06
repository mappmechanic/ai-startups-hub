'use client'

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getAllStartups, updateStartupRating } from '@/lib/db';
import { IStartup } from '@/lib/types';
import Rating from '@/components/Rating';
import { toast } from '@/components/ui/use-toast';

function StartupsContent() {
  const [startups, setStartups] = useState<IStartup[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const sortBy = searchParams.get('sortBy') || 'recent';
  const [isTopRated, setIsTopRated] = useState(sortBy === 'rating');

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

  const handleToggle = () => {
    const newIsTopRated = !isTopRated;
    setIsTopRated(newIsTopRated);
    const newSortBy = newIsTopRated ? 'rating' : 'recent';
    router.push(`?sortBy=${newSortBy}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">AI Startups</h1>
      <div className="mb-6 flex justify-center items-center">
        <span className={`mr-3 ${!isTopRated ? 'font-bold' : ''}`}>Most Recent</span>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isTopRated}
            onChange={handleToggle}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
        <span className={`ml-3 ${isTopRated ? 'font-bold' : ''}`}>Top Rated</span>
      </div>
      <ul className="space-y-6">
        {startups.map(startup => (
          <li key={startup.id} className="bg-white shadow-md rounded-lg p-6 text-left">
            <h2 className="text-2xl font-semibold mb-2">{startup.name}</h2>
            <p className="text-gray-600 mb-2">{startup.description}</p>
            <p className="text-sm text-gray-500 mb-1">
              <strong>Website:</strong> <a href={startup.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{startup.websiteUrl}</a>
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

export default function StartupsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StartupsContent />
    </Suspense>
  );
}
