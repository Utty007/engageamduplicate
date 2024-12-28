import React, { useState } from 'react';
import { EngagementResponse } from '@/typings';
import ImagePlaceholder from "@/app/assets/imgs/placeholder.png";
import Avatar from './Avatar';
import toast from 'react-hot-toast'
import Image from 'next/image';
import LoadingSpinner from './LoadingSpinner';
import { useUserStore } from '../stores/useUserStore';

interface AnalyticsCardProps {
  id: string | number;
  engagement_type: string;
  title: string;
  setIsPopupOpen: (isOpen: boolean) => void;
  setEngagementData: (data: EngagementResponse['data']) => void;
}


const AnalyticsCard = ({
  id,
  engagement_type,
  title,
  setIsPopupOpen,
  setEngagementData
}: AnalyticsCardProps) => {
   const user = useUserStore(state => state.user)
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalytics = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(
        `https://engageam.app/dashboard_php/posts/getEngagers.php?token=${token}&postid=${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch engagement data');
      }

      const data: EngagementResponse = await response.json();
      if (data.success) {
        setEngagementData(data.data);
        setIsPopupOpen(true);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full box-border p-3 sm:p-6 rounded-md border border-grey-stroke flex flex-col items-start gap-4">
      <div className="flex items-center gap-2">
        <Avatar initials={`${user?.firstname.slice(0,1)}${user?.lastname.slice(0,1)}`}/>
        <div className="flex flex-col gap-1">
          <h2 className="text-dark-100 font-bold">{`${user?.firstname} ${user?.lastname}`}</h2>
          <span className="text-gray-400">@{user?.display_name}</span>
        </div>
      </div>
      <p className="text-greyBase text-sm">{title}</p>
      <Image src={ImagePlaceholder} alt="Placeholder" className='w-full' />
      <h4 className="text-sm text-gray-600">Requested: {engagement_type}</h4>
        <button
          onClick={handleAnalytics}
          disabled={isLoading}
          className="flex items-center justify-center border border-dark-100 w-full p-2 gap-2 rounded-md"
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            'View analytics'
          )}
        </button>
    </div>
  );
};

export default AnalyticsCard;