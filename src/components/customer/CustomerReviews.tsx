
"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { fetchCustomerReviews } from '@/lib/api';
import StarRating from '@/components/ui/StarRating';
import ProfilePicture from '@/components/ui/ProfilePicture';
import WriteReview from '@/components/customer/WriteReview';
import { CustomerReview, CustomerReviewsResponse } from '@/types/customer';

const CustomerReviewsContent = ({ productId }: { productId: string }) => {
  const [reviewsData, setReviewsData] = useState<CustomerReviewsResponse | null>(null);
  const [reloadFlag, setReloadFlag] = useState(0);

  const loadReviews = useCallback(async () => {
    const data = await fetchCustomerReviews(productId);
    setReviewsData(data);
  }, [productId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews, reloadFlag]);

  const handleReviewSubmitted = () => {
    setReloadFlag((f) => f + 1);
  };

  if (!reviewsData) return <div>Loading reviews...</div>;
  return (
    <div className="bg-white border-2 border-orange-300/50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">{reviewsData.ratingBreakdown.averageRating}</div>
            <div className="flex items-center gap-1 mb-1">
              <StarRating rating={reviewsData.ratingBreakdown.averageRating}/>
            </div>
            <div className="text-sm text-gray-600">{reviewsData.ratingBreakdown.totalReviews} reviews</div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-orange-50 border-2 border-orange-300/50 border-dashed rounded p-4">
          <h3 className="font-medium text-gray-800 mb-3">Rating Breakdown</h3>
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-3 mb-2">
              <span className="text-sm text-gray-600 w-8">{stars} ★</span>
              <div className="flex-1 bg-gray-300/40 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${(reviewsData.ratingBreakdown.ratingsCount[stars as 1 | 2 | 3 | 4 | 5] || 0) / reviewsData.ratingBreakdown.totalReviews * 100}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 w-8">{reviewsData.ratingBreakdown.ratingsCount[stars as 1 | 2 | 3 | 4 | 5] || 0}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6 mb-8">
  {reviewsData.reviews.map((review: CustomerReview) => (
          <div key={review.id} className="border-b-2 border-gray-200 pb-6">
            <div className="flex items-start gap-4">
              <ProfilePicture 
                imageUrl={review.reviewerProfileImageUrl} 
                fallbackText={review.reviewerName[0]} 
                size="w-10 h-10" 
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-gray-800">{review.reviewerName}</span>
                  <div className="flex items-center gap-1">
                    <StarRating rating={review.rating} />
                  </div>
                  <span className="text-sm text-gray-500">{review.reviewDate}</span>
                </div>
                <p className="text-gray-700 mb-2">{review.reviewText}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

  <WriteReview productId={productId} onReviewSubmitted={handleReviewSubmitted} />

    </div>
  );
};

export default CustomerReviewsContent;
