import React from 'react';

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
        <img src={imageUrl} alt={fallbackText} className="w-full h-full object-cover" />
      ) : (
        <span className="text-xs">{fallbackText}</span>
      )}
    </div>
  );
};

export default ProfilePicture;
