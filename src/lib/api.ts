
// Shared delay time for all API mocks (ms)
export const DELAY_TIME = 500;

// API utility functions

// Import mock data
import { mockCustomerReviewsData, mockQuickStatsData, mockPersonalInfoData, mockInventoryData } from "./mockData";
import { ItemDetails, PaginatedData, SearchFilters, ShoppingItem } from "@/types/shopping";
import { CartItem, ShippingAndTaxValues } from "@/types/cart";
import { CustomerReviewsResponse } from "@/types/customer";
import { QuickStatsData, PersonalInfoData, InventoryData } from "@/types/seller";

// Function to fetch small items grid data
export async function fetchItemsGridData(pageIndex = 0, pageSize = 4) {
  try {
    // Use absolute URL for server-side requests
    const baseUrl = typeof window === 'undefined' 
      ? process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      : '';
      
    const response = await fetch(`${baseUrl}/api/products?page=${pageIndex + 1}&limit=${pageSize}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform API response to match ShoppingItem type
    const items = data.products.map((product: any) => {
      const averageRating = product.reviews.length > 0 
        ? product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.reviews.length
        : 0;
      
      return {
        id: product.id,
        imageAlt: product.name,
        imageUrl: product.imageUrl || '/images/placeholder.png',
        productName: product.name,
        sellerName: `${product.seller?.firstName || ''} ${product.seller?.lastName || ''}`.trim() || 'Seller',
        price: Number(product.price),
        rating: averageRating,
        isAddedToCart: false,
      };
    });

    return {
      items,
      totalCount: data.pagination.total,
      pageSize,
      pageIndex,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      items: [],
      totalCount: 0,
      pageSize,
      pageIndex,
    };
  }
}

// Function to fetch large items grid data
export async function fetchSearchItemsData(query: string, pageIndex = 0, pageSize = 10): Promise<PaginatedData<ShoppingItem>> {
  try {
    const searchParams = new URLSearchParams({
      page: (pageIndex + 1).toString(),
      limit: pageSize.toString(),
    });

    if (query) {
      searchParams.append('search', query);
    }

    // Apply filters from sessionStorage
    if (typeof window !== 'undefined') {
      const filters = sessionStorage.getItem('filters');
      if (filters) {
        try {
          const parsed: SearchFilters = JSON.parse(filters);
          if (parsed.category) searchParams.append('category', parsed.category);
          if (parsed.minPrice) searchParams.append('minPrice', parsed.minPrice.toString());
          if (parsed.maxPrice) searchParams.append('maxPrice', parsed.maxPrice.toString());
        } catch {}
      }
    }

    // Use absolute URL for server-side requests
    const baseUrl = typeof window === 'undefined' 
      ? process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      : '';
      
    const response = await fetch(`${baseUrl}/api/products?${searchParams}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform API response to match ShoppingItem type
    const items = data.products.map((product: any) => {
      const averageRating = product.reviews.length > 0 
        ? product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.reviews.length
        : 0;
      
      return {
        id: product.id,
        imageAlt: product.name,
        imageUrl: product.imageUrl || '/images/placeholder.png',
        productName: product.name,
        sellerName: `${product.seller?.firstName || ''} ${product.seller?.lastName || ''}`.trim() || 'Seller',
        price: Number(product.price),
        rating: averageRating,
        isAddedToCart: false,
      };
    });

    return {
      items,
      totalCount: data.pagination.total,
      pageSize,
      pageIndex,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      items: [],
      totalCount: 0,
      pageSize,
      pageIndex,
    };
  }
}

// Function to fetch categories data
export async function fetchCategoriesData(): Promise<string[]> {
  // Import at runtime to avoid circular dependencies
  const { CATEGORIES } = await import('./constants');
  return [...CATEGORIES];
}

// Function to fetch item details by id
export async function fetchItemDetailsById(id: string): Promise<ItemDetails | undefined> {
  try {
    // Use absolute URL for server-side requests
    const baseUrl = typeof window === 'undefined' 
      ? process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      : '';
    
    const response = await fetch(`${baseUrl}/api/products/${id}`, {
      method: 'GET',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return undefined;
      }
      const errorText = await response.text();
      throw new Error(`Failed to fetch product: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const product = data.product;
    
    if (!product) {
      return undefined;
    }
    
    // Calculate average rating from reviews
    const averageRating = product.reviews.length > 0 
      ? product.reviews.reduce((sum: any, review: any) => sum + review.rating, 0) / product.reviews.length
      : 0;
    
    // Fetch seller's statistics (rating and review count across all their products)
    let sellerRating = 0;
    let sellerReviewCount = 0;
    
    if (product.seller?.id) {
      try {
        // Get all products by this seller with their reviews
        const sellerProductsResponse = await fetch(`${baseUrl}/api/products?sellerId=${product.seller.id}`, {
          method: 'GET',
        });
        
        if (sellerProductsResponse.ok) {
          const sellerProductsData = await sellerProductsResponse.json();
          const sellerProducts = sellerProductsData.products || [];
          
          // Calculate overall seller rating and review count
          let totalRating = 0;
          let totalReviews = 0;
          
          sellerProducts.forEach((sellerProduct: any) => {
            if (sellerProduct.reviews && sellerProduct.reviews.length > 0) {
              const productAvgRating = sellerProduct.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / sellerProduct.reviews.length;
              totalRating += productAvgRating * sellerProduct.reviews.length;
              totalReviews += sellerProduct.reviews.length;
            }
          });
          
          sellerRating = totalReviews > 0 ? Number((totalRating / totalReviews).toFixed(1)) : 0;
          sellerReviewCount = totalReviews;
        }
      } catch (error) {
        console.error('Error fetching seller statistics:', error);
        // Fallback to defaults if seller stats fetch fails
        sellerRating = 0;
        sellerReviewCount = 0;
      }
    }
    
    // Transform API response to match ItemDetails type
    return {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      description: product.description,
      material: product.material || 'Various',
      capacity: product.capacity || 'N/A',
      dimensions: product.dimensions || 'N/A',
      care: product.careInstructions || 'Handle with care',
      seller: {
        name: `${product.seller?.firstName || ''} ${product.seller?.lastName || ''}`.trim() || 'Seller',
        memberSince: product.seller?.memberSince ? new Date(product.seller.memberSince).getFullYear().toString() : '2020',
        rating: sellerRating,
        reviews: sellerReviewCount,
        profileImageUrl: product.seller?.profilePictureUrl || '/images/user_placeholder.png',
      },
      images: product.imageUrl ? [product.imageUrl] : ['/images/placeholder.png'],
      rating: averageRating,
      reviews: product._count?.reviews || 0,
      isAddedToCart: false,
    };
  } catch (error) {
    console.error('Error fetching product details:', error);
    return undefined;
  }
}

// Function to handle add to cart action
export async function handleAddToCart(itemId: string, quantity = 1): Promise<{ status: number; message: string; itemId: string;}> {
  try {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ productId: itemId, quantity }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to add item to cart');
    }

    return { status: response.status, message: data.message, itemId };
  } catch (error) {
    console.error("Failed to add item to cart:", error);
    throw error;
  }
}

// Function to handle remove from cart action
export async function handleRemoveFromCart(cartItemId: string): Promise<{ status: number; message: string; itemId: string;}> {
  try {
    const response = await fetch(`/api/cart/${cartItemId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to remove item from cart');
    }

    return { status: response.status, message: data.message, itemId: cartItemId };
  } catch (error) {
    console.error("Failed to remove item from cart:", error);
    throw error;
  }
}

// Function to fetch customer reviews data
export async function fetchCustomerReviews(productId: string): Promise<CustomerReviewsResponse> {
  try {
    const response = await fetch(`/api/reviews?productId=${productId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch reviews: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform API response to match CustomerReviewsResponse type
    return {
      reviews: data.reviews.map((review: any) => ({
        id: review.id,
        reviewerName: review.reviewerName,
        rating: review.rating,
        reviewText: review.reviewText,
        reviewDate: new Date(review.reviewDate).toLocaleDateString(),
        reviewerProfileImageUrl: review.reviewerProfileImageUrl || '/images/user_placeholder.png',
      })),
      summary: {
        averageRating: data.summary.averageRating,
        totalReviews: data.summary.totalReviews,
        ratingsCount: data.summary.ratingBreakdown || {
          1: 0, 2: 0, 3: 0, 4: 0, 5: 0
        },
      },
    };
  } catch (error) {
    console.error('Error fetching customer reviews:', error);
    return mockCustomerReviewsData; // Fallback to mock
  }
}

// Function to submit a customer review
export async function submitCustomerReview({ productId, rating, title, text }: { productId: string; rating: number; title: string; text: string; }): Promise<{ status: number; message: string; }> {
  try {
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ 
        productId, 
        rating, 
        title, 
        comment: text 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit review');
    }

    return { status: response.status, message: data.message };
  } catch (error) {
    console.error("Failed to submit review:", error);
    throw error;
  }
}

// Function to fetch cart items
export async function fetchCartItems(): Promise<CartItem[]> {
  try {
    const response = await fetch('/api/cart', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cart: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform API response to match CartItem type
    return data.items.map((item: any) => ({
      cartItemId: item.id, // Store the cart item ID for removal
      shoppingItem: {
        id: item.product.id,
        imageAlt: item.product.name,
        imageUrl: item.product.imageUrl || '/images/placeholder.png',
        productName: item.product.name,
        sellerName: 'Seller', // We'll need to add seller info to the API response later
        price: Number(item.product.price),
        rating: 4.5, // Mock rating for now
        isAddedToCart: true,
      },
      quantity: item.quantity,
    }));
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }
}

// Function to fetch shipping and tax values
export async function fetchShippingAndTax(): Promise<ShippingAndTaxValues> {
  // Calculate dynamic shipping and tax based on cart contents
  try {
    const cartItems = await fetchCartItems();
    const subtotal = cartItems.reduce((sum, item) => sum + (item.shoppingItem.price * item.quantity), 0);
    
    // Basic shipping calculation - free shipping over $50
    const shippingCost = subtotal > 50 ? 0 : 8.99;
    
    // Basic tax calculation - 8% tax rate
    const taxRate = 0.08;
    const taxAmount = subtotal * taxRate;
    
    return { shippingCost, taxAmount };
  } catch (error) {
    console.error("Failed to fetch shipping and tax values:", error);
    // Fallback to default values
    return { shippingCost: 8.99, taxAmount: 15.36 };
  }
}

// Function to handle a checkout API call
export async function handleCheckout(shippingAddress: string): Promise<{ status: number; message: string; }> {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ shippingAddress }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Checkout failed');
    }

    return { status: response.status, message: data.message };
  } catch (error) {
    console.error("Checkout failed:", error);
    throw error;
  }
}

// Function to fetch Quick Stats data
export async function fetchQuickStatsData(): Promise<QuickStatsData> {
  try {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.status}`);
    }

    const userData = await response.json();
    const user = userData.user;

    // If user is not a seller, return empty stats
    if (!user.isSeller) {
      return {
        activeProducts: 0,
        avgRating: 0,
        totalReviews: 0,
      };
    }

    // Fetch real seller statistics
    const [productsResponse, reviewsResponse] = await Promise.all([
      fetch(`/api/products?sellerId=${user.id}`, {
        method: 'GET',
        credentials: 'include',
      }),
      fetch(`/api/reviews?targetId=${user.id}`, {
        method: 'GET',
        credentials: 'include',
      })
    ]);

    let activeProducts = 0;
    let avgRating = 0;
    let totalReviews = 0;

    if (productsResponse.ok) {
      const productsData = await productsResponse.json();
      activeProducts = productsData.pagination?.total || 0;
    }

    if (reviewsResponse.ok) {
      const reviewsData = await reviewsResponse.json();
      totalReviews = reviewsData.summary?.totalReviews || 0;
      avgRating = reviewsData.summary?.averageRating || 0;
    }

    return {
      activeProducts,
      avgRating: Number(avgRating.toFixed(1)),
      totalReviews,
    };
  } catch (error) {
    console.error('Error fetching seller stats:', error);
    return mockQuickStatsData; // Fallback to mock
  }
}

// Function to fetch Personal Info data
export async function fetchPersonalInfoData(): Promise<PersonalInfoData> {
  try {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.status}`);
    }

    const data = await response.json();
    const user = data.user;
    
    // Transform API response to match PersonalInfoData type
    return {
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone || 'N/A',
      profilePictureUrl: user.profilePictureUrl || '/images/user_placeholder.png',
    };
  } catch (error) {
    console.error('Error fetching personal info:', error);
    return mockPersonalInfoData; // Fallback to mock
  }
}

// Update Personal Info data via API
export async function updatePersonalInfoData(data: Partial<PersonalInfoData>): Promise<PersonalInfoData> {
  try {
    // Split fullName into firstName and lastName if provided
    const updateData: any = {};
    
    if (data.fullName) {
      const nameParts = data.fullName.trim().split(' ');
      updateData.firstName = nameParts[0] || '';
      updateData.lastName = nameParts.slice(1).join(' ') || '';
    }
    
    if (data.email) updateData.email = data.email;
    if (data.phone && data.phone !== 'N/A') updateData.phone = data.phone;
    if (data.profilePictureUrl) updateData.profilePictureUrl = data.profilePictureUrl;

    const response = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update profile: ${response.status}`);
    }

    const result = await response.json();
    const user = result.user;
    
    // Return updated personal info in the expected format
    return {
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone || 'N/A',
      profilePictureUrl: user.profilePictureUrl || '/images/user_placeholder.png',
    };
  } catch (error) {
    console.error('Error updating personal info:', error);
    throw error;
  }
}

// Function to fetch Inventory data
export async function fetchInventoryData(query: string, pageIndex = 0, pageSize = 10, category?: string, status?: string): Promise<{
  items: InventoryData[];
  totalCount: number;
  pageSize: number;
  pageIndex: number;
}> {
  try {
    // First get current user info to filter by their products only
    const userResponse = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    const userData = await userResponse.json();
    const userId = userData.user.id;

    const searchParams = new URLSearchParams({
      page: (pageIndex + 1).toString(),
      limit: pageSize.toString(),
      sellerId: userId, // Only fetch current user's products
    });

    if (query) {
      searchParams.append('search', query);
    }
    if (category) {
      searchParams.append('category', category);
    }

    const response = await fetch(`/api/products?${searchParams}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform API response to match InventoryData type
    const items = data.products.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      material: 'Various', // Mock - need to add to schema
      capacity: 'N/A', // Mock - need to add to schema
      dimensions: 'N/A', // Mock - need to add to schema
      care: 'Handle with care', // Mock - need to add to schema
      seller: {
        name: 'You', // Current user's products
        memberSince: '2020',
        rating: 4.5,
        reviews: 100,
        profileImageUrl: '/images/user_placeholder.png',
      },
      images: product.imageUrl ? [product.imageUrl] : ['/images/placeholder.png'],
      rating: 4.5, // Mock - need reviews system
      reviews: 25, // Mock - need reviews system
      isAddedToCart: false,
      stock: product.stock,
      price: Number(product.price),
      status: 'Active', // Mock - need status in schema
      sku: `SKU${product.id.slice(0, 6)}`, // Mock SKU
      category: product.category,
      views: 100, // Mock - need views tracking
    }));

    return {
      items,
      totalCount: data.pagination.total,
      pageSize,
      pageIndex,
    };
  } catch (error) {
    console.error('Error fetching inventory data:', error);
    // Fallback to mock data
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
}

// Fetch a single inventory item by id
export async function fetchInventoryItemById(id: string): Promise<InventoryData | undefined> {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status}`);
    }

    const data = await response.json();
    const product = data.product;
    
    // Transform API response to match InventoryData type
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      material: product.material || 'Various',
      capacity: product.capacity || 'N/A',
      dimensions: product.dimensions || 'N/A',
      care: product.careInstructions || 'Handle with care',
      seller: {
        name: `${product.seller?.firstName || ''} ${product.seller?.lastName || ''}`.trim() || 'You',
        memberSince: product.seller?.memberSince ? new Date(product.seller.memberSince).getFullYear().toString() : '2020',
        rating: 4.5,
        reviews: 100,
        profileImageUrl: product.seller?.profilePictureUrl || '/images/user_placeholder.png',
      },
      images: product.imageUrl ? [product.imageUrl] : ['/images/placeholder.png'],
      rating: 4.5,
      reviews: product._count?.reviews || 0,
      isAddedToCart: false,
      stock: product.stock,
      price: Number(product.price),
      status: 'ACTIVE',
      sku: `SKU${product.id.slice(0, 6)}`,
      category: product.category,
      views: 100,
    };
  } catch (error) {
    console.error('Error fetching product details:', error);
    return undefined;
  }
}

// Update an inventory item by id
export async function updateInventoryItemById(id: string, data: Partial<InventoryData>): Promise<InventoryData | undefined> {
  try {
    // Transform InventoryData to API format
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.images !== undefined && Array.isArray(data.images) && data.images.length > 0) {
      updateData.imageUrl = data.images[0]; // Use first image
    }

    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update product: ${response.status}`);
    }

    const result = await response.json();
    const product = result.product;
    
    // Transform API response back to InventoryData format
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      material: product.material || 'Various',
      capacity: product.capacity || 'N/A',
      dimensions: product.dimensions || 'N/A',
      care: product.careInstructions || 'Handle with care',
      seller: {
        name: 'You',
        memberSince: '2020',
        rating: 4.5,
        reviews: 100,
        profileImageUrl: '/images/user_placeholder.png',
      },
      images: product.imageUrl ? [product.imageUrl] : ['/images/placeholder.png'],
      rating: 4.5,
      reviews: 0,
      isAddedToCart: false,
      stock: product.stock,
      price: Number(product.price),
      status: 'ACTIVE',
      sku: `SKU${product.id.slice(0, 6)}`,
      category: product.category,
      views: 100,
    };
  } catch (error) {
    console.error('Error updating product:', error);
    return undefined;
  }
}

// Add a new inventory item
export async function addInventoryItem(data: InventoryData): Promise<InventoryData> {
  try {
    // Transform InventoryData to API format
    const createData: any = {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      stock: data.stock,
    };
    
    if (data.images && Array.isArray(data.images) && data.images.length > 0) {
      createData.imageUrl = data.images[0]; // Use first image
    }

    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(createData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Create product error:', response.status, errorData);
      
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      throw new Error(`Failed to create product: ${response.status} - ${errorData}`);
    }

    const result = await response.json();
    const product = result.product;
    
    // Transform API response back to InventoryData format
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      material: product.material || 'Various',
      capacity: product.capacity || 'N/A',
      dimensions: product.dimensions || 'N/A',
      care: product.careInstructions || 'Handle with care',
      seller: {
        name: 'You',
        memberSince: '2020',
        rating: 4.5,
        reviews: 100,
        profileImageUrl: '/images/user_placeholder.png',
      },
      images: product.imageUrl ? [product.imageUrl] : ['/images/placeholder.png'],
      rating: 4.5,
      reviews: 0,
      isAddedToCart: false,
      stock: product.stock,
      price: Number(product.price),
      status: 'ACTIVE',
      sku: `SKU${product.id.slice(0, 6)}`,
      category: product.category,
      views: 100,
    };
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

// Delete an inventory item by id
export async function deleteInventoryItem(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete product: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}

// Function to fetch status options
export async function fetchStatusOptions(): Promise<string[]> {
  // Return the ProductStatus enum values
  return ['ACTIVE', 'DRAFT', 'OUT_OF_STOCK', 'ARCHIVED', 'DISCONTINUED'];
}
