"use client"

import React, { useEffect, useCallback, useState } from 'react';
import ProfileCard from '../components/ProfileCard';
import TwitterLogo from '@/app/assets/svgs/X.svg';
import InstagramLogo from '@/app/assets/svgs/instagram.svg';
import TiktokLogo from '@/app/assets/svgs/tiktok.svg';
import PointsCard from '../components/PointsCard';
import PointsIcon from '@/app/assets/svgs/Frame1000003851.svg';
import CompletedIcon from '@/app/assets/svgs/completedengage.svg';
import AwaitingIcon from '@/app/assets/svgs/awaitingengage.svg';
import AnalyticsCard from '../components/AnalyticsCard';
import { BottomPopup } from './BottomPopUp';
import PostEngagement from './PostEngagements';
import { getAllUserPosts } from '../api/dashboardApi';
import LoadingSpinner from './LoadingSpinner';
import { EngagementResponse } from '@/typings';
import { getLocalStorageItem } from '../utils/localStorage';
import { useUserStore } from '../stores/useUserStore';
import { useStore } from '../stores/store';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const BACKGROUND_REFRESH_INTERVAL = 30000; // 30 seconds

const Dashboard = () => {
  const { user } = useUserStore();
  const { 
    userPosts, 
    isLoading,
    setUserPosts,
    setIsLoading 
  } = useStore();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [engagementData, setEngagementData] = useState<EngagementResponse['data']>([]);

  const token = getLocalStorageItem('token');
  const [error, setError] = useState<string | null>(null);
 const [lastFetchedAt, setLastFetchedAt] = useState<number | null>(null);

  const loadPosts = useCallback(async () => {
    if (!token) {
      setError('No authentication token found');
      setIsLoading(false);
      return;
    }

    const now = Date.now();
    if (lastFetchedAt && now - lastFetchedAt < CACHE_DURATION) {
      setIsLoading(false);
      return;
    }

    try {
      const postsData = await getAllUserPosts(token);
      setUserPosts(postsData);
      setLastFetchedAt(now);
    } catch (err) {
      setError('Failed to load posts');
      console.error('Failed to load posts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token, lastFetchedAt]);

   useEffect(() => {
    loadPosts();
  }, [loadPosts]);


  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      loadPosts();
    }, BACKGROUND_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [token, loadPosts]);

    if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (isLoading && userPosts.length === 0) {
    return <LoadingSpinner />;
  }

  const Handles = [
    { ProfileName: 'UthmanKayode', username: 'Utty007', Logo: <TwitterLogo /> },
    { ProfileName: 'UthmanKayode', username: 'Utty007', Logo: <InstagramLogo /> },
    { ProfileName: 'UthmanKayode', username: 'Utty007', Logo: <TiktokLogo /> },
  ];

  const Engagements = [
    { Title: 'Total Points', Point: user?.balance ?? undefined, Icon: <PointsIcon /> },
    { Title: 'Pending Engagements', Point: user?.pending_engagement ?? undefined, Icon: <AwaitingIcon /> },
    { Title: 'Completed Engagements', Point: user?.completed_engagement ?? undefined, Icon: <CompletedIcon /> },
  ];

  return (
    <>
      <BottomPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
        <PostEngagement data={engagementData} />
      </BottomPopup>
      <div className="p-6">
        <section>
          <h1 className="text-dark-100 font-semibold text-lg sm:text-xl mb-4">
            Social accounts
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
            {Handles.map((handle, index) => (
              <ProfileCard
                key={index}
                ProfileName={handle.ProfileName}
                Username={handle.username}
                Logo={handle.Logo}
              />
            ))}
          </div>
        </section>
        <section className="mt-8">
          <h1 className="text-dark-100 font-semibold text-xl mb-4">
            Engagement overview
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Engagements.map((engagement, index) => (
              <PointsCard
                key={index}
                Title={engagement.Title}
                Points={engagement.Point}
                Icon={engagement.Icon}
              />
            ))}
          </div>
        </section>
        <section className="mt-8">
          <h1 className="text-dark-100 font-semibold text-xl mb-4">Analytics</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <AnalyticsCard
                  key={post.id}
                  setIsPopupOpen={setIsPopupOpen} 
                  setEngagementData={setEngagementData}
                  id={post.id}
                  engagement_type={post.engagement_type}
                  title={post.title}
                />
              ))
            ) : (
              <p>No posts found</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;