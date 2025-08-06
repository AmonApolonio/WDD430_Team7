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
      <div className="aspect-square bg-orange-50 border-2 border-orange-300/50 border-dashed rounded-lg flex items-center justify-center">
        <Image
          src={selectedImage}
          alt={name}
          width={500}
          height={500}
          className="rounded-lg object-contain w-full"
          style={{ width: '100%', height: 'auto' }}
          priority
        />
      </div>
      <Slider {...settings}>
        {images.map((image, index) => (
            <div
            key={index}
            className="cursor-pointer px-1"
            onClick={() => setSelectedImage(image)}
            >
            <Image
              src={image}
              alt={`${name} ${index + 1}`}
              width={128}
              height={128}
              className={`rounded object-cover h-32 w-full ${selectedImage === image ? 'border-2 border-orange-400 rounded' : ''}`}
              style={{ width: '100%', height: 'auto' }}
            />
            </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductImages;
