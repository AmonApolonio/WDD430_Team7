"use client";

import React, { useState } from 'react';
import Layout from '@/components/common/Layout';
import { ProductCard } from '@/components/ui/ProductCard';
import { fetchSearchItemsData } from '@/lib/api';
import Pagination from '@mui/material/Pagination';
import { useSearchParams } from "next/navigation";

const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [pageIndex, setPageIndex] = useState(1); // MUI Pagination is 1-based
  const pageSize = 9;

  // Fetch data based on query and pagination
  const { items: products, totalCount } = fetchSearchItemsData(query, pageIndex - 1, pageSize);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageIndex(value);
  };

  return (
    <Layout>
      <main className="max-w-7xl mx-auto">
        <div className="mb-6 w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Search Results for "{query}"
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

        <div className="mt-8">
          <Pagination
            count={Math.ceil(totalCount / pageSize)}
            page={pageIndex}
            onChange={handlePageChange}
            color="primary"
            className="flex justify-center mt-4"
          />
        </div>
      </main>
    </Layout>
  );
};

export default SearchResults;
