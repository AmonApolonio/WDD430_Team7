
import React, { Suspense } from 'react';
import Layout from '@/components/common/Layout';
import { fetchSearchItemsData } from '@/lib/api';
import { SearchResultsSkeleton } from '@/components/ui/Skeletons';
import SearchPageClient from '@/components/search/SearchPageClient';

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function SearchResults({ query, pageIndex, pageSize }: { query: string; pageIndex: number; pageSize: number }) {
  const { items: products, totalCount } = await fetchSearchItemsData(query, pageIndex - 1, pageSize);
  
  return (
    <SearchPageClient 
      query={query}
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
  const pageIndex = Math.max(1, Number(params?.page) || 1);
  const pageSize = 9;

  const suspenseKey = `${query}-${pageIndex}`;

  return (
    <Layout>
      <main className="max-w-7xl mx-auto p-6">
        <Suspense key={suspenseKey} fallback={<SearchResultsSkeleton />}>
          <SearchResults query={query} pageIndex={pageIndex} pageSize={pageSize} />
        </Suspense>
      </main>
    </Layout>
  );
}
