'use client';

import React, { useState, useEffect } from 'react';
import { ProductCard } from '@/components/ui/ProductCard';
import Pagination from '@mui/material/Pagination';
import { useRouter } from 'next/navigation';
import { ShoppingItem } from '@/types/shopping';

interface SearchPageClientProps {
  query: string;
  category?: string;
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  products: ShoppingItem[];
}

// Client component for pagination functionality
function SearchPagination({ 
  totalCount, 
  pageSize, 
  currentPage, 
  query 
}: {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  query: string;
}) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  // Reset loading state when currentPage changes (navigation is complete)
  useEffect(() => {
    setIsNavigating(false);
  }, [currentPage]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    // Prevent navigation if already on the same page or currently navigating
    if (value === currentPage || isNavigating) return;
    
    setIsNavigating(true);
    
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    params.set('page', value.toString());
    
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    router.push(`/search?${params.toString()}`);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        className="flex justify-center"
        size="large"
        showFirstButton
        showLastButton
        siblingCount={1}
        boundaryCount={1}
        disabled={isNavigating}
      />
      <p className="text-sm text-gray-600">
        Page {currentPage} of {totalPages} ({totalCount} total results)
      </p>
    </div>
  );
}

export default function SearchPageClient({ 
  query, 
  category,
  pageIndex, 
  pageSize, 
  totalCount, 
  products 
}: SearchPageClientProps) {
  const searchTitle = category ? `${category} Products` : query ? `Search Results for "${query}"` : 'All Products';
  const hasSearchCriteria = query || category;

  if (!hasSearchCriteria) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Search for Products</h2>
        <p className="text-gray-600">Enter a search term to find products.</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          No Results Found for {category ? `"${category}"` : `"${query}"`}
        </h2>
        <p className="text-gray-600">Try adjusting your search terms or browse our categories.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {searchTitle}
        </h2>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Showing {products.length} of {totalCount} results
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

      <SearchPagination 
        totalCount={totalCount}
        pageSize={pageSize}
        currentPage={pageIndex}
        query={query}
      />
    </>
  );
}
