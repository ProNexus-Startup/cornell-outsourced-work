import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
  numRaters?: number;
  showNumRaters?: boolean;
}

const StarRating = ({
  rating,
  numRaters = 0,
  showNumRaters = true,
}: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className="w-5 h-5 fill-yellow-400 text-yellow-400"
        />
      ))}
      {hasHalfStar && (
        <StarHalf className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
      ))}
      {showNumRaters && numRaters > 0 && (
        <span className="ml-2 text-sm text-gray-600">({numRaters})</span>
      )}
    </div>
  );
};

export default StarRating;
