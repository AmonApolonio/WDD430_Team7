"use client";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button as MuiButton,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export function ProductCard({
  imageAlt,
  imageUrl,
  productName,
  sellerName,
  price,
  rating,
  className,
  children,
}: {
  imageAlt: string;
  imageUrl: string;
  productName: string;
  sellerName: string;
  price: string;
  rating: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const [imgSrc, setImgSrc] = useState(imageUrl || "/images/placeholder.png");
  const [hasErrored, setHasErrored] = useState(false);

  const handleImageError = () => {
    if (!hasErrored) {
      setHasErrored(true);
      setImgSrc("/images/placeholder.png");
    }
  };

  return (
    <Card
      className={className}
      sx={{
        maxWidth: 256,
        border: "2px dashed #ccc",
        boxShadow: "none",
        transition: "transform 0.1s",
        "&:hover": {
          transform: "scale(1.04)",
        },
      }}
    >
      <div>
        <CardMedia
          component="img"
          height="120"
          image={imgSrc}
          alt={imageAlt || "placeholder"}
          onError={handleImageError}
          sx={{ objectFit: "cover" }}
        />
        <CardContent sx={{ padding: 1.5 }}>
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{ fontSize: "1rem" }}
          >
            {productName}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            gutterBottom
            sx={{ fontSize: "0.875rem" }}
          >
            by {sellerName}
          </Typography>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography
              variant="h6"
              color="textPrimary"
              sx={{ fontSize: "1rem" }}
            >
              {price}
            </Typography>
            <Box display="flex" alignItems="center" gap={0.5}>
              <FontAwesomeIcon icon={faStar} style={{ color: "#FFD700" }} />
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ fontSize: "0.875rem" }}
              >
                {rating}
              </Typography>
            </Box>
          </Box>
          <MuiButton
            variant="outlined"
            fullWidth
            size="small"
            sx={{
              borderRadius: "8px",
              textTransform: 'none',
              "&:hover": {
                backgroundColor: "primary.light",
                borderColor: "primary.light",
              },
            }}
            color="primary"
          >
            Add to Cart
          </MuiButton>
          {children}
        </CardContent>
      </div>
    </Card>
  );
}