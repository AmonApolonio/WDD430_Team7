"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import Layout from '@/components/common/Layout';
import CustomerReviews from '@/components/customer/CustomerReviews';
import ProductImages from '@/components/product/ProductImages';
import { fetchItemDetailsById } from '@/lib/api';
import { ItemDetails } from '@/types/shopping';
import { Button } from '@/components/ui/Button';
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import StarRating from '@/components/ui/StarRating';
import ProfilePicture from '@/components/ui/ProfilePicture';

// Item Page (dynamic route for individual product items)
const ItemPage = () => {
  const { id } = useParams();
  const itemId = Array.isArray(id) ? id[0] : id;
  const [itemDetails, setItemDetails] = useState<ItemDetails | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (itemId) {
      const fetchedItem = fetchItemDetailsById(itemId);
      if (fetchedItem) {
        setItemDetails(fetchedItem);
      }
    }
  }, [itemId]);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
  };

  if (!itemDetails) {
    return <div>Loading...</div>;
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
              <span className="text-3xl font-bold text-gray-800">${itemDetails.price.toFixed(2)}</span>
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
                <Button
                  variant={isFavorite ? "filled" : "outline"}
                  className="text-orange-400 px-2 py-1"
                  onClick={handleFavoriteClick}
                >
                  <FontAwesomeIcon icon={faHeart} />
                </Button>
                <Button variant="outline" className="text-orange-400 px-2 py-1" onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('URL copied to clipboard!');
                }}>
                  <FontAwesomeIcon icon={faShareAlt} />
                </Button>
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

        <CustomerReviews productId={itemDetails.id} />
      </main>
    </Layout>
  );
};

export default ItemPage;
