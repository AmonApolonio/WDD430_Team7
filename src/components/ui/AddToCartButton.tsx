"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./Button";
import { handleAddToCart } from "@/lib/api";
import { useState } from "react";
import { toast } from "react-toastify";

interface AddToCartButtonProps {
  itemId: string;
  initialIsAddedToCart: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ itemId, initialIsAddedToCart, onClick }) => {
  const [isAddedToCart, setIsAddedToCart] = useState(initialIsAddedToCart);

  const handleAddToCartClick = async (e: React.MouseEvent) => {
    if (onClick) onClick(e);
    const response = await handleAddToCart(itemId);
    if (response?.status === 200) {
      setIsAddedToCart(true);
      toast.success("Item added to cart!");
    } else {
      // toast.error("Failed to add item to cart.");
    }
  };

  const handleRemoveFromCartClick = async (e: React.MouseEvent) => {
    if (onClick) onClick(e);
    // For now, just toggle the state since this component is used in product listings
    // The actual cart removal will be handled in the cart page
    setIsAddedToCart(false);
    toast.success("Item marked as not in cart!");
  };

  return (
    <Button
      variant="outline-filled"
      onClick={isAddedToCart ? handleRemoveFromCartClick : handleAddToCartClick}
    >
      <FontAwesomeIcon
        icon={isAddedToCart ? faTrash : faShoppingCart}
        className="h-4 w-4 mr-2"
      />
      {isAddedToCart ? "Remove from Cart" : "Add to Cart"}
    </Button>
  );
};
