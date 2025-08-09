"use client";
import React, { useState } from "react";
import { Button } from ".";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShareAlt } from '@fortawesome/free-solid-svg-icons';

interface ItemFavoriteShareProps {
  itemId: string;
}

const ItemFavoriteShare: React.FC<ItemFavoriteShareProps> = () => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorite((prev) => !prev);
  };

  const handleShareClick = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert("URL copied to clipboard!");
    }
  };

  return (
    <>
      <Button
        variant={isFavorite ? "filled" : "outline"}
        className="text-orange-400 px-2 py-1"
        onClick={handleFavoriteClick}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <FontAwesomeIcon icon={faHeart} />
      </Button>
      <Button
        variant="outline"
        className="text-orange-400 px-2 py-1"
        onClick={handleShareClick}
        aria-label="Share item"
      >
        <FontAwesomeIcon icon={faShareAlt} />
      </Button>
    </>
  );
};

export default ItemFavoriteShare;
