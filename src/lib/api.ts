
// Shared delay time for all API mocks (ms)
export const DELAY_TIME = 500;

// artificial delay for suspense testing
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// API utility functions

// Import mock data
import { mockShoppingItemsData, mockCategoriesData, mockItemDetailsData, mockCustomerReviewsData, mockCartItems, mockQuickStatsData, mockPersonalInfoData, mockBusinessInfoData, mockInventoryData, mockStatusOptionsData } from "./mockData";
import { ItemDetails, PaginatedData, SearchFilters, ShoppingItem } from "@/types/shopping";
import { CartItem, ShippingAndTaxValues } from "@/types/cart";
import { CustomerReviewsResponse } from "@/types/customer";
import { QuickStatsData, PersonalInfoData, BusinessInfoData, InventoryData } from "@/types/seller";

// Function to fetch small items grid data
export async function fetchItemsGridData(pageIndex = 0, pageSize = 4) {
  await delay(DELAY_TIME);
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
export async function fetchSearchItemsData(query: string, pageIndex = 0, pageSize = 10): Promise<PaginatedData<ShoppingItem>> {
  await delay(DELAY_TIME);
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const paginatedData = mockShoppingItemsData.slice(start, end);

   // Also apply the filters in the search
  if (typeof window !== 'undefined') {
    const filters = sessionStorage.getItem('filters');
    if (filters) {
      try {
        const parsed: SearchFilters = JSON.parse(filters);
        console.log('Filters from sessionStorage:', parsed);
      } catch {}
    }
  }

  return {
    items: paginatedData,
    totalCount: mockShoppingItemsData.length,
    pageSize,
    pageIndex,
  };
}

// Function to fetch categories data
export async function fetchCategoriesData(): Promise<string[]> {
  await delay(DELAY_TIME);
  return mockCategoriesData;
}

// Function to fetch item details by id
export async function fetchItemDetailsById(id: string): Promise<ItemDetails | undefined> {
  await delay(DELAY_TIME);
  console.log("Fetching item details for id:", id);
  
  return mockItemDetailsData;
}

// Function to handle add to cart action
export async function handleAddToCart(itemId: string): Promise<{ status: number; message: string; itemId: string;}> {
  await delay(DELAY_TIME);
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
  await delay(DELAY_TIME);
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
export async function fetchCustomerReviews(productId: string): Promise<CustomerReviewsResponse> {
  await delay(DELAY_TIME);
  console.log("Fetching customer reviews for product:", productId);
  return mockCustomerReviewsData;
}

// Function to submit a customer review
export async function submitCustomerReview({ productId, rating, title, text }: { productId: string; rating: number; title: string; text: string; }): Promise<{ status: number; message: string; }> {
  await delay(DELAY_TIME);
  console.log("Submitting review:", { productId, rating, title, text });
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
export async function fetchCartItems(): Promise<CartItem[]> {
  await delay(DELAY_TIME);
  return mockCartItems;
}

// Function to fetch shipping and tax values
export async function fetchShippingAndTax(): Promise<ShippingAndTaxValues> {
  await delay(DELAY_TIME);
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
  await delay(DELAY_TIME);
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
export async function fetchQuickStatsData(): Promise<QuickStatsData> {
  await delay(DELAY_TIME);
  return mockQuickStatsData;
}

// Function to fetch Personal Info data
export async function fetchPersonalInfoData(): Promise<PersonalInfoData> {
  await delay(DELAY_TIME);
  return mockPersonalInfoData;
}

// Function to fetch Business Info data
export async function fetchBusinessInfoData(): Promise<BusinessInfoData> {
  await delay(DELAY_TIME);
  return mockBusinessInfoData;
}

// Update Personal Info data (mock, mutates in-memory object)
export async function updatePersonalInfoData(data: Partial<PersonalInfoData>): Promise<PersonalInfoData> {
  await delay(DELAY_TIME);
  Object.assign(mockPersonalInfoData, data);
  return mockPersonalInfoData;
}

// Update Business Info data (mock, mutates in-memory object)
export async function updateBusinessInfoData(data: Partial<BusinessInfoData>): Promise<BusinessInfoData> {
  await delay(DELAY_TIME);
  Object.assign(mockBusinessInfoData, data);
  return mockBusinessInfoData;
}

// Function to fetch Inventory data
export async function fetchInventoryData(query: string, pageIndex = 0, pageSize = 10, category?: string, status?: string): Promise<{
  items: InventoryData[];
  totalCount: number;
  pageSize: number;
  pageIndex: number;
}> {
  await delay(DELAY_TIME);
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
export async function fetchInventoryItemById(id: string): Promise<InventoryData | undefined> {
  await delay(DELAY_TIME);
  return mockInventoryData.find(item => item.id === id);
}

// Update an inventory item by id (mock, mutates in-memory array)
export async function updateInventoryItemById(id: string, data: Partial<InventoryData>): Promise<InventoryData | undefined> {
  await delay(DELAY_TIME);
  const idx = mockInventoryData.findIndex(item => item.id === id);
  if (idx === -1) return undefined;
  mockInventoryData[idx] = { ...mockInventoryData[idx], ...data };
  return mockInventoryData[idx];
}

// Add a new inventory item (mock, adds to in-memory array)
export async function addInventoryItem(data: InventoryData): Promise<InventoryData> {
  await delay(DELAY_TIME);
  mockInventoryData.push(data);
  return data;
}

// Delete an inventory item by id (mock, removes from in-memory array)
export async function deleteInventoryItem(id: string): Promise<boolean> {
  await delay(DELAY_TIME);
  const idx = mockInventoryData.findIndex(item => item.id === id);
  if (idx === -1) return false;
  mockInventoryData.splice(idx, 1);
  return true;
}

// Function to fetch status options (mocked)
export async function fetchStatusOptions(): Promise<string[]> {
  await delay(5000);
  return mockStatusOptionsData;
}
