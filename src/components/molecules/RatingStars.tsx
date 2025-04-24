import React, { useState } from 'react';

interface RatingStarsProps {
  maxRating: number;
  onRatingSelect: (rating: number) => void;
}

export const RatingStars: React.FC<RatingStarsProps> = ({ maxRating, onRatingSelect }) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const handleClick = (rating: number) => {
    setSelectedRating(rating);
    onRatingSelect(rating);
  };

  const getRatingText = (rating: number | null) => {
    if (!rating) return '';
    if (rating <= 2) return 'Very Bad';
    if (rating <= 4) return 'Bad';
    if (rating <= 6) return 'Average';
    if (rating <= 8) return 'Good';
    return 'Excellent';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center space-y-4 max-h-48 overflow-y-auto scrollbar-hide" role="radiogroup" aria-label="Rating selection">
        {Array.from({ length: maxRating }, (_, i) => i + 1).map((rating) => (
          <button
            key={rating}
            onClick={() => handleClick(rating)}
            className={`text-5xl ${selectedRating && selectedRating >= rating ? 'text-yellow-500' : 'text-gray-300'}`}
            aria-label={`Rate ${rating} star${rating > 1 ? 's' : ''}`}
            type="button"
          >
            <span className="relative">
              ★
              <span className="absolute inset-0 flex items-center justify-center text-white text-2xl">
                {rating}
              </span>
            </span>
          </button>
        ))}
      </div>
      {selectedRating && (
        <p className="mt-4 text-sm text-gray-600">{getRatingText(selectedRating)}</p>
      )}
    </div>
  );
};