import React, { useState } from 'react';
import Progressbar from './Progressbar';
import AppButton from './AppButton';
import Avatar from './Avatar';
import { BottomPopup } from './BottomPopUp';
import PostEngagement from './PostEngagements';

interface EngagementCardProps {
  name: string;
  username: string;
  title: string;
  socialText?: string;
  engagementText: string;
  engagementType: string;
  engagementNo: number;
  engagementNoreached: number;
  id: number | string;
}

const EngagementCard = ({
  name,
  username,
  title,
  socialText,
  engagementText,
  engagementType,
  engagementNo,
  engagementNoreached,
  id,
}: EngagementCardProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
 

  const handlePopupToggle = () => {
    setIsPopupOpen((prev) => !prev);
  };
  return (
    <>
      <BottomPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
        <PostEngagement id={id} />
      </BottomPopup>
      <div className="border w-full sm:w-fit min-w-[330px] border-[#E4E4E7] shadow shadow-[#0000000D] rounded-lg flex flex-col gap-6 p-6">
        <div className="flex gap-2 items-center">
          <Avatar initials={name} />
          <div className="flex flex-col gap-1 items-start">
            <p className="font-semibold text-base text-dark-100">{name}</p>
            <p className="text-sm text-grey-900">{username}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-semibold text-lg">{title}</p>
          <a href={socialText} target="_blank" rel="noopener noreferrer">
            <p className="text-sm text-primary">{`Click to ${engagementType} on the post`}</p>
          </a>
          <p className="text-dark-500 text-sm">{`Requested: ${engagementText}`}</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <p className="text-black text-sm">{engagementType}</p>
              <p className="text-sm text-black">{`${engagementNoreached}/${engagementNo}`}</p>
            </div>
            <Progressbar current={engagementNoreached} total={engagementNo} />
          </div>
        </div>
        <AppButton
          onClick={handlePopupToggle}
          wrapperClassName="border border-black bg-white !w-[280px]"
          textClassName="!text-dark-400"
          btnText="View Engagements"
        />
      </div>
    </>
  );
};

export default EngagementCard;
