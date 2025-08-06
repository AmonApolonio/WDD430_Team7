import React from 'react';
import Image from 'next/image';

interface ProfilePictureProps {
  imageUrl?: string;
  fallbackText: string;
  size?: string;
  borderColor?: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  imageUrl,
  fallbackText,
  size = 'w-12 h-12',
  borderColor = 'border-orange-300/50',
}) => {
  return (
    <div
      className={`${size} bg-gray-300 rounded-full border-2 ${borderColor} flex items-center justify-center overflow-hidden`}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={fallbackText}
          width={48}
          height={48}
          className="w-full h-full object-cover"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span className="text-xs">{fallbackText}</span>
      )}
    </div>
  );
};

export default ProfilePicture;
