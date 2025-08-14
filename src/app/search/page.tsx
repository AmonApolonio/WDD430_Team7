
import React, { Suspense } from 'react';
import Layout from '@/components/common/Layout';
import { fetchSearchItemsData } from '@/lib/api';
import { SearchResultsSkeleton } from '@/components/ui/Skeletons';
import SearchPageClient from '@/components/search/SearchPageClient';

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function SearchResults({ query, category, pageIndex, pageSize }: { query: string; category: string; pageIndex: number; pageSize: number }) {
  // For category filtering, we'll pass the category directly to fetchSearchItemsData
  // and modify the API call to handle category filtering on the server side
  const searchQuery = category || query;
  const { items: products, totalCount } = await fetchSearchItemsData(searchQuery, pageIndex - 1, pageSize);
  
  return (
    <SearchPageClient 
      query={query}
      category={category}
      pageIndex={pageIndex}
      pageSize={pageSize}
      totalCount={totalCount}
      products={products}
    />
  );
}

// Server Component using Suspense for data fetching
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = typeof params?.query === 'string' ? params.query : '';
  const category = typeof params?.category === 'string' ? params.category : '';
  const pageIndex = Math.max(1, Number(params?.page) || 1);
  const pageSize = 9;

  const suspenseKey = `${query}-${category}-${pageIndex}`;

  return (
    <Layout>
      <main className="max-w-7xl mx-auto p-6">
        <Suspense key={suspenseKey} fallback={<SearchResultsSkeleton />}>
          <SearchResults query={query} category={category} pageIndex={pageIndex} pageSize={pageSize} />
        </Suspense>
      </main>
    </Layout>
  );
}
