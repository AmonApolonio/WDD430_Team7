// API utility functions

// Import mock data
import { mockShoppingItemsData, mockCategoriesData } from "./mockData";

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
export function fetchLargeItemsGridData(query: string, pageIndex = 0, pageSize = 10) {
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
