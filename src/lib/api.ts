// API utility functions

// Import mock data
import { mockShoppingItemsData, mockCategoriesData, mockItemDetailsData, mockCustomerReviewsData, mockCartItems, mockQuickStatsData, mockPersonalInfoData, mockBusinessInfoData, mockInventoryData, mockStatusOptionsData } from "./mockData";
import { ItemDetails } from "@/types/shopping";
import { CartItem, ShippingAndTaxValues } from "@/types/cart";
import { CustomerReviewsResponse } from "@/types/customer";
import { QuickStatsData, PersonalInfoData, BusinessInfoData, AccountStatsData, InventoryData } from "@/types/seller";

// Function to fetch small items grid data
export function fetchItemsGridData(pageIndex = 0, pageSize = 4) {
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const paginatedData = mockShoppingItemsData.slice(start, end);
  return {
    items: paginatedData,
    totalCount: mockShoppingItemsData.length,
    pageSize,
    pageIndex,
  };
}

// Function to fetch large items grid data
export function fetchSearchItemsData(query: string, pageIndex = 0, pageSize = 10) {
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const paginatedData = mockShoppingItemsData.slice(start, end);
  return {
    items: paginatedData,
    totalCount: mockShoppingItemsData.length,
    pageSize,
    pageIndex,
  };
}

// Function to fetch categories data
export function fetchCategoriesData() {
  return mockCategoriesData;
}

// Function to fetch item details by id
export function fetchItemDetailsById(id: string): ItemDetails | undefined {
  return mockItemDetailsData;
}

// Function to handle add to cart action
export async function handleAddToCart(itemId: string): Promise<{ status: number; message: string; itemId: string;}> {
  try {
    const response = await new Promise<{ status: number; message: string; itemId: string; }>((resolve) => {
      setTimeout(() => {
        resolve({ status: 200, message: "Item added to cart successfully", itemId });
      }, 1000);
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error("Failed to add item to cart:", error);
    throw error;
  }
}

// Function to handle remove from cart action
export async function handleRemoveFromCart(itemId: string): Promise<{ status: number; message: string; itemId: string;}> {
  try {
    const response = await new Promise<{ status: number; message: string; itemId: string; }>((resolve) => {
      setTimeout(() => {
        resolve({ status: 200, message: "Item removed from cart successfully", itemId });
      }, 1000);
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error("Failed to remove item from cart:", error);
    throw error;
  }
}

// Function to fetch customer reviews data
export function fetchCustomerReviews(productId: string): CustomerReviewsResponse {
  return mockCustomerReviewsData;
}

// Function to submit a customer review
export async function submitCustomerReview({ productId, rating, title, text }: { productId: string; rating: number; title: string; text: string; }): Promise<{ status: number; message: string; }> {
  try {
    const response = await new Promise<{ status: number; message: string; }>((resolve) => {
      setTimeout(() => {
        resolve({ status: 200, message: "Review submitted successfully" });
      }, 1000);
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error("Failed to submit review:", error);
    throw error;
  }
}

// Function to fetch cart items
export function fetchCartItems(): CartItem[] {
  return mockCartItems;
}

// Function to fetch shipping and tax values
export async function fetchShippingAndTax(): Promise<ShippingAndTaxValues> {
  try {
    const response = await new Promise<ShippingAndTaxValues>((resolve) => {
      setTimeout(() => {
        resolve({ shippingCost: 8.99, taxAmount: 15.36 });
      }, 500);
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch shipping and tax values:", error);
    throw error;
  }
}

// Function to handle a checkout API call
export async function handleCheckout(): Promise<{ status: number; message: string; }> {
  try {
    const response = await new Promise<{ status: number; message: string; }>((resolve) => {
      setTimeout(() => {
        resolve({ status: 200, message: "Checkout completed successfully" });
      }, 1000);
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error("Checkout failed:", error);
    throw error;
  }
}

// Function to fetch Quick Stats data
export function fetchQuickStatsData(): QuickStatsData {
  return mockQuickStatsData;
}

// Function to fetch Personal Info data
export function fetchPersonalInfoData(): PersonalInfoData {
  return mockPersonalInfoData;
}

// Function to fetch Business Info data
export function fetchBusinessInfoData(): BusinessInfoData {
  return mockBusinessInfoData;
}

// Update Personal Info data (mock, mutates in-memory object)
export function updatePersonalInfoData(data: Partial<PersonalInfoData>): PersonalInfoData {
  Object.assign(mockPersonalInfoData, data);
  return mockPersonalInfoData;
}

// Update Business Info data (mock, mutates in-memory object)
export function updateBusinessInfoData(data: Partial<BusinessInfoData>): BusinessInfoData {
  Object.assign(mockBusinessInfoData, data);
  return mockBusinessInfoData;
}

// Function to fetch Inventory data
export function fetchInventoryData(query: string, pageIndex = 0, pageSize = 10, category?: string, status?: string): {
  items: InventoryData[];
  totalCount: number;
  pageSize: number;
  pageIndex: number;
} {
  // Filtering logic (mock)
  let filtered = mockInventoryData;
  if (query) {
    filtered = filtered.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
  }
  if (category) {
    filtered = filtered.filter(item => item.category === category);
  }
  if (status) {
    filtered = filtered.filter(item => item.status === status);
  }
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const paginatedData = filtered.slice(start, end);
  return {
    items: paginatedData,
    totalCount: filtered.length,
    pageSize,
    pageIndex,
  };
}

// Fetch a single inventory item by id
export function fetchInventoryItemById(id: string): InventoryData | undefined {
  return mockInventoryData.find(item => item.id === id);
}

// Update an inventory item by id (mock, mutates in-memory array)
export function updateInventoryItemById(id: string, data: Partial<InventoryData>): InventoryData | undefined {
  const idx = mockInventoryData.findIndex(item => item.id === id);
  if (idx === -1) return undefined;
  mockInventoryData[idx] = { ...mockInventoryData[idx], ...data };
  return mockInventoryData[idx];
}

// Add a new inventory item (mock, adds to in-memory array)
export function addInventoryItem(data: InventoryData): InventoryData {
  mockInventoryData.push(data);
  return data;
}

// Delete an inventory item by id (mock, removes from in-memory array)
export function deleteInventoryItem(id: string): boolean {
  const idx = mockInventoryData.findIndex(item => item.id === id);
  if (idx === -1) return false;
  mockInventoryData.splice(idx, 1);
  return true;
}

// Function to fetch status options (mocked)
export function fetchStatusOptions(): string[] {
  return mockStatusOptionsData;
}
