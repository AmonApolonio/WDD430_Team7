
import React, { Suspense } from "react";
import { fetchCategoriesData, fetchItemsGridData } from "@/lib/api";
import { ShoppingItem } from "@/types/shopping";
import FeaturedSellerItems from "@/components/product/FeaturedSellerItems";
import Image from "next/image";
import { HomePageSkeleton } from "@/components/ui/Skeletons";

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomePageContent />
    </Suspense>
  );
}

async function HomePageContent() {
  const { items }: { items: ShoppingItem[] } = (await fetchItemsGridData()) || { items: [] };
  const categories = await fetchCategoriesData();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="mb-8">
        <Image
          src="/images/hero.jpg"
          alt="Hero Banner"
          width={1920}
          height={256}
          className="w-full h-64 object-cover rounded-lg border-2 border-orange-300/50"
          priority
        />
      </section>

      {/* Featured Sellers Section */}
      <FeaturedSellerItems items={items} />

      {/*/!* Categories Section *!/*/}
      {/*<section className="mt-12">*/}
      {/*  <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>*/}
      {/*  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">*/}
      {/*    {categories.map((category) => (*/}
      {/*      <a*/}
      {/*        key={category}*/}
      {/*        href={`/search?category=${encodeURIComponent(category)}`}*/}
      {/*        className="h-32 bg-orange-50 border-2 border-orange-300/50 border-dashed rounded-lg flex items-center justify-center transition-transform transform hover:scale-105 hover:bg-orange-300 cursor-pointer"*/}
      {/*      >*/}
      {/*        <span className="font-semibold text-gray-600">{category}</span>*/}
      {/*      </a>*/}
      {/*    ))}*/}
      {/*  </div>*/}
      {/*</section>*/}
    </div>
  );
}
