import { ItemDetails } from "@/types/shopping";

export interface QuickStatsData {
  activeProducts: number;
  avgRating: number;
  totalReviews: number;
  totalSales: number;
}

export interface PersonalInfoData {
  fullName: string;
  email: string;
  phone: string;
  profilePictureUrl: string;
}

export interface BusinessInfoData {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
}

export interface AccountStatsData {
  totalSales: number;
  totalRevenue: number;
  totalOrders: number;
}

export interface InventoryData extends ItemDetails {
  stock: number;
  status: string;
  sku: string;
  category: string;
  views: number;
}