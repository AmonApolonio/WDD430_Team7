import { ProductCard } from "@/components/ui/ProductCard";
import { ShoppingItem } from "@/types/shopping";

interface FeaturedSellerItemsProps {
  items: ShoppingItem[];
}

const FeaturedSellerItems: React.FC<FeaturedSellerItemsProps> = ({ items }) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Featured Seller Items</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.length > 0 ? (
          items.map((item: ShoppingItem) => (
            <ProductCard
              key={item.id}
              product={item}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">No items available.</p>
        )}
      </div>
    </section>
  );
};

export default FeaturedSellerItems;
