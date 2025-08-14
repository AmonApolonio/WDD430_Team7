export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profilePictureUrl?: string;
  memberSince: string;
  isSeller: boolean;
  productCount: number;
}