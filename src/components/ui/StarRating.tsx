import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

type StarRatingProps = {
  rating: number;
  maxStars?: number;
  className?: string;
  starSize?: string;
};

const StarRating: React.FC<StarRatingProps> = ({ rating, maxStars = 5, className = '', starSize = 'h-5 w-5' }) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[...Array(maxStars)].map((_, i) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.25 && rating % 1 <= 0.75;

        if (i < fullStars) {
          return <FontAwesomeIcon key={i} icon={faStar} className={`${starSize} text-yellow-400`} />;
        } else if (i === fullStars && hasHalfStar) {
          return <FontAwesomeIcon key={i} icon={faStarHalf} className={`${starSize} text-yellow-400`} />;
        } else {
          return <FontAwesomeIcon key={i} icon={faStar} className={`${starSize} text-gray-300`} />;
        }
      })}
    </div>
  );
};

export default StarRating;
