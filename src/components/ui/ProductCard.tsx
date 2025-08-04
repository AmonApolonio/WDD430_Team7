"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShoppingItem } from "@/types/shopping";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({
  product,
  className,
  children,
}: {
  product: ShoppingItem;
  className?: string;
  children?: React.ReactNode;
}) {
  const [imgSrc, setImgSrc] = useState(product.imageUrl || "/images/placeholder.png");
  const [hasErrored, setHasErrored] = useState(false);
  const router = useRouter();

  const handleImageError = () => {
    if (!hasErrored) {
      setHasErrored(true);
      setImgSrc("/images/placeholder.png");
    }
  };

  const handleCardClick = () => {
    router.push(`/item/${product.id}`);
  };

  return (
    <div
      className={`min-w-[16rem] text-gray-600 border-2 border-dashed border-orange-300/50 bg-orange-50shadow-none transition-transform duration-100 cursor-pointer hover:scale-105 rounded-lg ${className}`}
      onClick={handleCardClick}
    >
      <div>
        <img
          src={imgSrc}
          alt={product.imageAlt || "placeholder"}
          onError={handleImageError}
          className="w-full h-40 object-cover rounded-t-lg"
        />
        <div className="p-3 rounded-b-lg">
          <h3 className="font-semibold">{product.productName}</h3>
          <p className="text-sm text-secondary mb-2">by {product.sellerName}</p>
          <div className="flex justify-between items-center mb-2">
            <span className="text-base text-primary">{formatCurrency(product.price)}</span>
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
              <span className="text-sm text-secondary">{product.rating}</span>
            </div>
          </div>
          <AddToCartButton
            itemId={product.id}
            initialIsAddedToCart={product.isAddedToCart}
            onClick={(e) => e.stopPropagation()} // Prevent triggering handleCardClick
          />
          {children}
        </div>
      </div>
    </div>
  );
}