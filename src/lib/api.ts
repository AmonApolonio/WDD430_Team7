// API utility functions

// Import mock data
import { mockShoppingItemsData, mockCategoriesData, mockItemDetailsData, mockCustomerReviewsData } from "./mockData";
import { ItemDetails } from "@/types/shopping";
import { CustomerReviewsResponse } from "@/types/customer";

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
