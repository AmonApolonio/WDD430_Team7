
import React, { Suspense } from 'react';
import Layout from '@/components/common/Layout';
import ProductImages from '@/components/product/ProductImages';
import { fetchItemDetailsById } from '@/lib/api';
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import StarRating from '@/components/ui/StarRating';
import ProfilePicture from '@/components/ui/ProfilePicture';
import { formatCurrency } from '@/lib/utils';
import CustomerReviewsContent from '@/components/customer/CustomerReviews';
import { CustomerReviewsSkeleton, ItemPageSkeleton } from '@/components/ui/Skeletons';
import ItemFavoriteShare from '@/components/ui/ItemFavoriteShare';


interface ItemPageProps {
  params: Promise<{ id: string }>;
}


// Separate component for async data fetching
const ItemContent = async ({ params }: ItemPageProps) => {
  const resolvedParams = await params;
  const itemId = Array.isArray(resolvedParams.id) ? resolvedParams.id[0] : resolvedParams.id;
  if (!itemId) {
    return (
      <Layout>
        <main className="max-w-7xl mx-auto p-6">
          <div className="text-center text-red-600">Invalid item.</div>
        </main>
      </Layout>
    );
  }
  const itemDetails = await fetchItemDetailsById(itemId);
  if (!itemDetails) {
    return (
      <Layout>
        <main className="max-w-7xl mx-auto p-6">
          <div className="text-center text-red-600">Item not found.</div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <ProductImages images={itemDetails.images} name={itemDetails.name} />

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{itemDetails.name}</h1>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex gap-1">
                  <StarRating rating={itemDetails.rating} />
                  <span className="text-sm text-gray-600 ml-1">
                    {itemDetails.rating} ({itemDetails.reviews} reviews)
                  </span>
                </div>
              </div>
              <p className="text-orange-400 font-semibold mb-4">
                by <span className="font-semibold">{itemDetails.seller.name}</span>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-gray-800">{formatCurrency(itemDetails.price)}</span>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
              <div className="bg-orange-50 border-2 border-orange-300/50 border-dashed rounded p-4">
                <p className="text-gray-600">{itemDetails.description}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Product Details</h3>
              <div className="bg-orange-50 border-2 border-orange-300/50 border-dashed rounded p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Material:</span>
                  <span className="text-gray-800">{itemDetails.material}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="text-gray-800">{itemDetails.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dimensions:</span>
                  <span className="text-gray-800">{itemDetails.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Care:</span>
                  <span className="text-gray-800">{itemDetails.care}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-orange-300/50 rounded-lg p-4">
              <div className="flex gap-3">
                <AddToCartButton itemId={itemDetails.id} initialIsAddedToCart={itemDetails.isAddedToCart} />
                <ItemFavoriteShare itemId={itemDetails.id} />
              </div>
            </div>

            <div className="bg-orange-50 border-2 border-orange-300/50 border-dashed rounded p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Seller Information</h3>
              <div className="flex items-center gap-3">
                <ProfilePicture 
                  imageUrl={itemDetails.seller.profileImageUrl} 
                  fallbackText={itemDetails.seller.name[0]} 
                />
                <div>
                  <p className="font-medium text-gray-800">{itemDetails.seller.name}</p>
                  <p className="text-sm text-gray-600">
                    Member since {itemDetails.seller.memberSince} • {itemDetails.seller.rating}★ ({itemDetails.seller.reviews} reviews)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Suspense fallback={<CustomerReviewsSkeleton />}>
          <CustomerReviewsContent productId={itemDetails.id} />
        </Suspense>
      </main>
    </Layout>
  );
};

const ItemPage = ({ params }: ItemPageProps) => {
  return (
    <Suspense fallback={<ItemPageSkeleton />}>
      <ItemContent params={params} />
    </Suspense>
  );
};

export default ItemPage;
