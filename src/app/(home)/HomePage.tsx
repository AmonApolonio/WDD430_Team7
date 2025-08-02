import { ProductCard } from "@/components/ui/ProductCard";
import { fetchCategoriesData, fetchItemsGridData } from "@/lib/api";
import { ShoppingItem } from "@/types/shopping";
import FeaturedSellerItems from "@/components/product/FeaturedSellerItems";

export default function HomePage() {
  const { items }: { items: ShoppingItem[] } = fetchItemsGridData() || { items: [] };
  const categories = fetchCategoriesData();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="mb-8">
        <img
          src="/images/hero.jpg"
          alt="Hero Banner"
          className="w-full h-64 object-cover rounded-lg border-2 border-gray-400"
        />
      </section>

      {/* Featured Sellers Section */}
      <FeaturedSellerItems items={items} />

      {/* Categories Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category}
              className="h-32 bg-gray-200 border-2 border-gray-400 border-dashed rounded-lg flex items-center justify-center transition-transform transform hover:scale-105 hover:bg-gray-300"
            >
              <span className="font-semibold text-gray-600">{category}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
