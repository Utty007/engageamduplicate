import React, { ReactNode } from 'react';
import LinkIcon from '@/app/assets/svgs/link.svg';

type Profile = {
  ProfileName: string;
  Username: string;
  Logo: ReactNode;
};

function ProfileCard({ ProfileName, Username, Logo }: Profile) {
  return (
    <div className="w-full p-4 sm:p-6 rounded-md border border-grey-100 col-span-1 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-dark-100 font-bold">{ProfileName}</h2>
          <span className="text-gray-400 text-xs">@{Username}</span>
        </div>
        {Logo}
      </div>
      <button className="flex items-center justify-center border border-dark-100 w-full p-1 sm:p-2 gap-2 rounded-md">
        <LinkIcon />
        <span>Link account</span>
      </button>
    </div>
  );
}

export default ProfileCard;
