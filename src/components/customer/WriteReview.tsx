import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { submitCustomerReview } from '@/lib/api';

const WriteReview = ({ productId }: { productId: string }) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');

  const isFormValid = selectedRating > 0 && reviewTitle.trim() !== '' && reviewText.trim() !== '';

  const handleSubmit = async () => {
    if (!isFormValid) {
      alert('Please fill in all fields before submitting your review.');
      return;
    }

    try {
      const response = await submitCustomerReview({
        productId,
        rating: selectedRating,
        title: reviewTitle,
        text: reviewText,
      });
      alert(response.message);
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  return (
    <div className="bg-orange-50 border-2 border-orange-300/50 border-dashed rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Write a Review</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <FontAwesomeIcon
                key={i}
                icon={faStar}
                className={`h-6 w-6 cursor-pointer ${i < (hoverRating || selectedRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                onClick={() => setSelectedRating(i + 1)}
                onMouseEnter={() => setHoverRating(i + 1)}
                onMouseLeave={() => setHoverRating(0)}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2">Review Title</label>
          <Input
            placeholder="Summarize your experience"
            className="border-2 border-orange-300/50 px-5 py-1 rounded-md w-full"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
          <textarea
            placeholder="Tell others about your experience with this product..."
            rows={4}
            className="border-2 border-orange-300/50 w-full rounded-lg p-2"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
        </div>

        <Button
          variant="filled"
          grow={true}
          className='px-3 py-2'
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          Submit Review
        </Button>
      </div>
    </div>
  );
};

export default WriteReview;
