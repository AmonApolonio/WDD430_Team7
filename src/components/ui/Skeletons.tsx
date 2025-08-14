// Skeleton for item page
export const ItemPageSkeleton: React.FC = () => (
  <Layout>
    <main className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images Skeleton */}
        <div className="bg-gray-200 animate-pulse rounded-lg h-96"></div>
        {/* Product Information Skeleton */}
        <div className="space-y-6">
          <div className="bg-gray-200 animate-pulse rounded h-8 w-3/4"></div>
          <div className="bg-gray-200 animate-pulse rounded h-4 w-1/2"></div>
          <div className="bg-gray-200 animate-pulse rounded h-6 w-1/4"></div>
          <div className="bg-gray-200 animate-pulse rounded-lg h-32"></div>
          <div className="bg-gray-200 animate-pulse rounded-lg h-40"></div>
          <div className="bg-gray-200 animate-pulse rounded-lg h-16"></div>
          <div className="bg-gray-200 animate-pulse rounded-lg h-20"></div>
        </div>
      </div>
      <div className="bg-gray-200 animate-pulse rounded-lg h-48"></div>
    </main>
  </Layout>
);
import React from 'react';
import Layout from '@/components/common/Layout';

// Generic skeleton loader for product cards
export const ProductCardSkeleton: React.FC = () => (
  <div className="border-2 border-orange-300/50 border-dashed rounded-lg p-4">
    <div className="bg-gray-200 animate-pulse rounded-lg h-48 mb-4"></div>
    <div className="bg-gray-200 animate-pulse rounded h-4 w-3/4 mb-2"></div>
    <div className="bg-gray-200 animate-pulse rounded h-3 w-1/2 mb-3"></div>
    <div className="bg-gray-200 animate-pulse rounded h-5 w-1/3"></div>
  </div>
);

// Skeleton for home page
export const HomePageSkeleton: React.FC = () => (
  <div className="bg-white">
    {/* Hero Section Skeleton */}
    <section className="mb-8">
      <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg border-2 border-orange-300/50"></div>
    </section>

    {/* Featured Sellers Section Skeleton */}
    <section>
      <div className="bg-gray-200 animate-pulse rounded h-8 w-64 mb-6"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(4).fill(0).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </section>

    {/* Categories Section Skeleton */}
    <section className="mt-12">
      <div className="bg-gray-200 animate-pulse rounded h-8 w-48 mb-6"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array(8).fill(0).map((_, index) => (
          <div key={index} className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
        ))}
      </div>
    </section>
  </div>
);

// Skeleton for search results
export const SearchResultsSkeleton: React.FC = () => (
  <>
    <div className="mb-6 w-full">
      <div className="bg-gray-200 animate-pulse rounded h-8 w-64 mb-2"></div>
      <div className="bg-gray-200 animate-pulse rounded h-4 w-48"></div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(9).fill(0).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>

    <div className="mt-8 flex justify-center">
      <div className="bg-gray-200 animate-pulse rounded h-10 w-80"></div>
    </div>
  </>
);

// Skeleton for cart page
export const CartPageSkeleton: React.FC = () => (
  <Layout>
    <main className="max-w-7xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-gray-200 animate-pulse rounded h-10 w-40"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Skeleton */}
        <div className="lg:col-span-2">
          <div className="bg-white border-2 border-orange-300/50 border-dashed rounded-lg">
            <div className="border-b-2 border-orange-300/50 p-4">
              <div className="bg-gray-200 animate-pulse rounded h-6 w-32"></div>
            </div>
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="border-b-2 border-orange-300/50 p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-200 animate-pulse rounded-lg h-20 w-20"></div>
                  <div className="flex-1 space-y-2">
                    <div className="bg-gray-200 animate-pulse rounded h-5 w-3/4"></div>
                    <div className="bg-gray-200 animate-pulse rounded h-4 w-1/2"></div>
                    <div className="bg-gray-200 animate-pulse rounded h-4 w-1/3"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-gray-200 animate-pulse rounded h-8 w-20"></div>
                    <div className="bg-gray-200 animate-pulse rounded h-8 w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-white border-2 border-orange-300/50 border-dashed rounded-lg p-6 sticky top-6">
            <div className="bg-gray-200 animate-pulse rounded h-6 w-32 mb-4"></div>
            <div className="space-y-3 mb-6">
              {Array(4).fill(0).map((_, index) => (
                <div key={index} className="flex justify-between">
                  <div className="bg-gray-200 animate-pulse rounded h-4 w-16"></div>
                  <div className="bg-gray-200 animate-pulse rounded h-4 w-12"></div>
                </div>
              ))}
            </div>
            <div className="bg-gray-200 animate-pulse rounded-lg h-12 w-full"></div>
          </div>
        </div>
      </div>
    </main>
  </Layout>
);

// Skeleton for account page
export const AccountPageSkeleton: React.FC = () => (
  <Layout>
    <main className="max-w-7xl mx-auto p-6">
      {/* Page Header Skeleton */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-gray-200 animate-pulse rounded-full h-16 w-16"></div>
          <div className="space-y-2">
            <div className="bg-gray-200 animate-pulse rounded h-8 w-64"></div>
            <div className="bg-gray-200 animate-pulse rounded h-4 w-32"></div>
          </div>
        </div>

        {/* Quick Stats Skeleton */}
        <section>
          <div className="bg-gray-200 animate-pulse rounded h-8 w-32 mb-2"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </section>
      </div>

      {/* Tabs Navigation Skeleton */}
      <div className="w-full mb-6">
        <div className="bg-gray-200 animate-pulse rounded-lg h-12 w-full"></div>
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border-2 border-orange-300/50 border-dashed p-6 space-y-4">
          <div className="bg-gray-200 animate-pulse rounded h-6 w-48"></div>
          {Array(3).fill(0).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="bg-gray-200 animate-pulse rounded h-4 w-24"></div>
              <div className="bg-gray-200 animate-pulse rounded-lg h-10 w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </main>
  </Layout>
);

// Skeleton for inventory tab
export const InventoryTabSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Table Skeleton - Desktop */}
    <div className="hidden md:block overflow-x-auto">
      <div className="min-w-full rounded-lg">
        {Array(5).fill(0).map((_, index) => (
          <div key={index} className="px-6 py-4 border-b border-gray-200 last:border-b-0">
            <div className="flex justify-between items-center">
              <div className="bg-gray-200 animate-pulse rounded-lg h-12 w-12"></div>
              <div className="bg-gray-200 animate-pulse rounded h-4 w-32"></div>
              <div className="bg-gray-200 animate-pulse rounded h-4 w-20"></div>
              <div className="bg-gray-200 animate-pulse rounded h-4 w-16"></div>
              <div className="bg-gray-200 animate-pulse rounded h-6 w-16"></div>
              <div className="bg-gray-200 animate-pulse rounded-lg h-8 w-8"></div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Mobile Cards Skeleton */}
    <div className="md:hidden space-y-4">
      {Array(3).fill(0).map((_, index) => (
        <div key={index} className="border-2 border-orange-300/50 border-dashed rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gray-200 animate-pulse rounded-lg h-16 w-16"></div>
            <div className="flex-1 space-y-2">
              <div className="bg-gray-200 animate-pulse rounded h-5 w-3/4"></div>
              <div className="bg-gray-200 animate-pulse rounded h-4 w-1/2"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="bg-gray-200 animate-pulse rounded h-4 w-full"></div>
            <div className="bg-gray-200 animate-pulse rounded h-4 w-2/3"></div>
          </div>
        </div>
      ))}
    </div>

    {/* Pagination Skeleton */}
    <div className="flex justify-center">
      <div className="bg-gray-200 animate-pulse rounded h-10 w-80"></div>
    </div>
  </div>
);

// Skeleton for categories in filters dialog
export const CategoriesSkeleton: React.FC = () => (
  <div className="mb-4">
    <div className="bg-gray-200 animate-pulse rounded h-4 w-16 mb-2"></div>
    <div className="flex flex-col gap-1">
      {Array(6).fill(0).map((_, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="bg-gray-200 animate-pulse rounded h-4 w-4"></div>
          <div className="bg-gray-200 animate-pulse rounded h-4 w-20"></div>
        </div>
      ))}
    </div>
  </div>
);

// Skeleton for customer reviews
export const CustomerReviewsSkeleton: React.FC = () => (
  <div className="bg-white border-2 border-orange-300/50 rounded-lg p-6">
    <div className="flex items-center justify-between mb-6">
      <div className="bg-gray-200 animate-pulse rounded h-8 w-48"></div>
      <div className="text-center">
        <div className="bg-gray-200 animate-pulse rounded h-10 w-16 mb-2 mx-auto"></div>
        <div className="bg-gray-200 animate-pulse rounded h-4 w-20 mb-1 mx-auto"></div>
        <div className="bg-gray-200 animate-pulse rounded h-4 w-16 mx-auto"></div>
      </div>
    </div>

    <div className="mb-8">
      <div className="bg-orange-50 border-2 border-orange-300/50 border-dashed rounded p-4">
        <div className="bg-gray-200 animate-pulse rounded h-5 w-32 mb-3"></div>
        {[5, 4, 3, 2, 1].map((stars) => (
          <div key={stars} className="flex items-center gap-3 mb-2">
            <div className="bg-gray-200 animate-pulse rounded h-4 w-8"></div>
            <div className="flex-1 bg-gray-200 animate-pulse rounded-full h-2"></div>
            <div className="bg-gray-200 animate-pulse rounded h-4 w-8"></div>
          </div>
        ))}
      </div>
    </div>

    <div className="space-y-6 mb-8">
      {Array(3).fill(0).map((_, index) => (
        <div key={index} className="border-b-2 border-gray-200 pb-6">
          <div className="flex items-start gap-4">
            <div className="bg-gray-200 animate-pulse rounded-full h-10 w-10"></div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-gray-200 animate-pulse rounded h-4 w-24"></div>
                <div className="bg-gray-200 animate-pulse rounded h-4 w-20"></div>
                <div className="bg-gray-200 animate-pulse rounded h-4 w-16"></div>
              </div>
              <div className="bg-gray-200 animate-pulse rounded h-4 w-full mb-2"></div>
              <div className="bg-gray-200 animate-pulse rounded h-4 w-3/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="bg-orange-50 border-2 border-orange-300/50 border-dashed rounded-lg p-6">
      <div className="bg-gray-200 animate-pulse rounded h-6 w-32 mb-4"></div>
      <div className="space-y-4">
        <div>
          <div className="bg-gray-200 animate-pulse rounded h-4 w-20 mb-2"></div>
          <div className="bg-gray-200 animate-pulse rounded h-6 w-32"></div>
        </div>
        <div>
          <div className="bg-gray-200 animate-pulse rounded h-4 w-24 mb-2"></div>
          <div className="bg-gray-200 animate-pulse rounded-lg h-10 w-full"></div>
        </div>
        <div>
          <div className="bg-gray-200 animate-pulse rounded h-4 w-20 mb-2"></div>
          <div className="bg-gray-200 animate-pulse rounded-lg h-24 w-full"></div>
        </div>
        <div className="bg-gray-200 animate-pulse rounded-lg h-12 w-full"></div>
      </div>
    </div>
  </div>
);
