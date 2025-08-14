// Static categories for handcrafted marketplace
export const CATEGORIES = [
  "Jewelry",
  "Home Decor", 
  "Clothing",
  "Art",
  "Accessories",
  "Ceramics",
  "Textiles",
  "Woodwork",
  "Furniture",
  "Beauty & Personal Care",
  "Bags & Purses",
  "Toys & Games"
] as const;

export type Category = typeof CATEGORIES[number];

// Helper function to validate category
export function isValidCategory(category: string): category is Category {
  return CATEGORIES.includes(category as Category);
}