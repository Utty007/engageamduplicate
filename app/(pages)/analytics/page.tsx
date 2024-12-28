"use client";

import React, { useEffect, useState } from 'react';
import EngagementCard from '@/app/components/EngagementCard';
import { getUserPosts } from '@/app/api/postApi';
import toast from 'react-hot-toast';
import axios from 'axios';
import EngagementCardSkeleton from '@/app/components/EngagementCardSkeleton';
import useLoading from '@/app/hooks/useLoading';

interface PostsDataProps {
  title: string;
  link: string;
  engagement_type: string;
  engagement_no: number;
  engagement_no_reached: number;
  id: number;
  user: {
    fullname: string;
    username: string;
  };
}

const Analytics = () => {
  const [postsData, setPostsData] = useState<PostsDataProps[]>([]);
  const { isLoading, showLoader, hideLoader } = useLoading();

  useEffect(() => {
    let isMounted = true;

    const fetchUserPosts = async () => {
      if (!isLoading) {
        showLoader();
      }
      
      try {
        const response = await getUserPosts();
        
        if (!isMounted) return;

        if (response.success === true) {
          if (Array.isArray(response.data)) {
            setPostsData(response.data as PostsDataProps[]);
          } else {
            setPostsData([response.data as PostsDataProps]);
          }
          // Only show toast on successful data fetch
          toast.success(response.message);
        }
      } catch (error) {
        if (!isMounted) return;
        
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || 'Fetching post failed');
        }
        console.error('Fetch post error:', error);
        toast.error("Error fetching post. Please try again.")
      } finally {
        if (isMounted) {
          hideLoader();
        }
      }
    };

    fetchUserPosts();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []); // Add empty dependency array

  return (
    <div className="flex px-10 pb-10 flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-dark-100 font-semibold text-xl">
          Engagement Campaigns Progress
        </p>
        <p className="text-grey-900 text-sm">
          Track the progress of your engagement requests
        </p>
      </div>
      <div className="flex justify-start">
        {isLoading ? (
          <EngagementCardSkeleton />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-4 2xl:gap-6">
            {postsData?.map((item) => (
              <EngagementCard
                id={item.id}
                key={item.id}
                name={item.user.fullname}
                username={item.user.username}
                title={item.title}
                socialText={item.link}
                engagementText={item.engagement_type}
                engagementType={item.engagement_type}
                engagementNo={item.engagement_no}
                engagementNoreached={item.engagement_no_reached}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;