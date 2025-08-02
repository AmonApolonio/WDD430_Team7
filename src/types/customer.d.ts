// Interface for individual customer review
export interface CustomerReview {
  id: string;
  reviewerName: string;
  reviewerProfileImageUrl?: string
  rating: number;
  reviewDate: string;
  reviewText: string;
}

// Interface for overall rating breakdown
export interface RatingBreakdown {
  totalReviews: number;
  averageRating: number;
  ratingsCount: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

// Interface for customer reviews response
export interface CustomerReviewsResponse {
  ratingBreakdown: RatingBreakdown;
  reviews: CustomerReview[];
}