import getInitials from '@/app/utils/getInitials';
import { User } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

export type NumberOfInitials = 1 | 2;
export type AvatarFallback = 'image' | 'initials' | 'icon';
export interface AppAvatarProps {
  fallBack?: AvatarFallback;
  initials?: string | null;
  imageUrl?: string;
  numberOfInitials?: NumberOfInitials;
}

const Avatar: React.FC<AppAvatarProps> = ({
  fallBack = 'initials',
  initials = '',
  imageUrl,
  numberOfInitials = 1,
}) => {
  const renderAvatar = () => {
    switch (fallBack) {
      case 'image':
        return imageUrl ? (
          <div className="flex bg-[#f0e8ff] border rounded-full p-2 h-9 w-9">
            <Image
              src={imageUrl}
              alt="user avatar"
              className=""
              width={36}
              height={36}
            />
          </div>
        ) : null;
      case 'initials':
        return (
          <div className="flex bg-[#f0e8ff] border rounded-full px-3  py-2 items-center justify-center">
            <p className="font-bold text-base text-dark-600 text-center">
              {getInitials(initials, numberOfInitials)}
            </p>
          </div>
        );
      case 'icon':
        return (
          <div className="flex bg-[#f0e8ff] border rounded-full p-2  h-9 w-9">
            <User size={20} color="#6B6C74" />
          </div>
        );
      default:
        return null;
    }
  };

  return <>{renderAvatar()}</>;
};

export default Avatar;
