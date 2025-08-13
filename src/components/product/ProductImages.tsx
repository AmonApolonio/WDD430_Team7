"use client";

import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';

interface ProductImagesProps {
  images: string[];
  name: string;
}

const ProductImages: React.FC<ProductImagesProps> = ({ images, name }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
    ],
  };

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-orange-50 border-2 border-orange-300/50 border-dashed rounded-lg flex items-center justify-center overflow-hidden">
        <div className="w-full h-full aspect-square relative">
          <Image
            src={selectedImage}
            alt={name}
            fill
            className="rounded-lg object-cover w-full h-full"
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      </div>
      <Slider {...settings}>
        {images.map((image, index) => (
          <div
            key={index}
            className="cursor-pointer px-1"
            onClick={() => setSelectedImage(image)}
          >
            <div className="aspect-square w-full h-32 relative overflow-hidden">
              <Image
                src={image}
                alt={`${name} ${index + 1}`}
                fill
                className={`rounded object-cover w-full h-full ${selectedImage === image ? 'border-2 border-orange-400 rounded' : ''}`}
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductImages;
