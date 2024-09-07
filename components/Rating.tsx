'use client';

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  id: string;
  initialRating?: number;
  onRatingChange?: (newRating: number) => void;
}

const Rating: React.FC<RatingProps> = ({ id, initialRating = 0, onRatingChange }) => {
  const [rating, setRating] = useState(initialRating);

  useEffect(() => {
    const savedRating = localStorage.getItem(`rating_${id}`);
    if (savedRating) setRating(parseFloat(savedRating));
  }, [id]);

  const handleRating = (newRating: number) => {
    setRating(newRating);
    localStorage.setItem(`rating_${id}`, newRating.toString());
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleRating(star)}
          onMouseEnter={() => setRating(star)}
          onMouseLeave={() => {
            const savedRating = localStorage.getItem(`rating_${id}`);
            setRating(savedRating ? parseFloat(savedRating) : initialRating);
          }}
          className="text-yellow-400 hover:text-yellow-500 relative"
        >
          <Star
            className={`w-5 h-5 ${star <= rating ? 'fill-current' : 'stroke-current fill-transparent'}`}
          />
          {star <= rating && star - rating < 0 && star - rating > -1 && (
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Star className="w-5 h-5 fill-current text-yellow-400" />
            </div>
          )}
        </button>
      ))}
      <span className="ml-2">{rating.toFixed(1)}</span>
    </div>
  );
};

export default Rating;
