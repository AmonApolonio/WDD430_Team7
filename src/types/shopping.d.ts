export interface ShoppingItem {
  id: string;
  imageAlt: string;
  imageUrl: string;
  productName: string;
  sellerName: string;
  price: string;
  rating: number;
  isAddedToCart: boolean;
}

export interface ItemDetails {
  id: string;
  name: string;
  price: number;
  description: string;
  material: string;
  capacity: string;
  dimensions: string;
  care: string;
  seller: {
    name: string;
    memberSince: string;
    rating: number;
    reviews: number;
    profileImageUrl?: string;
  };
  images: string[];
  rating: number;
  reviews: number;
  isAddedToCart: boolean;
}
