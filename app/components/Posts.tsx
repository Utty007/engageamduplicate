/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useCallback } from 'react';
import { AllPost, EngagementResponse, Post } from '@/typings';
import { getLocalStorageItem } from '../utils/localStorage';
import { getAllPosts } from '../api/postsApi';
import LoadingSpinner from './LoadingSpinner';
import Overlay from './Overlay';
import PostForm from './PostForm';
import PostTypesBar from './PostTypeBar';
import FilterDropdown from './FilterDropdown';
import AnalyticsCard from './AnalyticsCard';
import PostsCard from './PostsCard';
import { getAllUserPosts } from '../api/dashboardApi';
import { BottomPopup } from './BottomPopUp';
import ImagePlaceholder from "@/app/assets/imgs/placeholder.png";
import PostEngagement from './PostEngagements';

const REFRESH_INTERVAL = 30000; // 30 seconds

const Posts = () => {
  const [userPosts, setUserPosts] = useState<Post[] | null>(null);
  const [posts, setPosts] = useState<AllPost[] | null>(null);
  const [activeType, setActiveType] = useState('Active');
  const [socialFilter, setSocialFilter] = useState('Allsocials');
  const [nicheFilter, setNicheFilter] = useState('');
  const [isAddPost, setIsAddPost] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [engagementData, setEngagementData] = useState<EngagementResponse['data']>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isLoadingUserPosts, setIsLoadingUserPosts] = useState(false);
  const [postsInProgress, setPostsInProgress] = useState<Record<string, string>>({});

  const loadPosts = useCallback(async () => {
    const token = getLocalStorageItem('token');
    if (token && !isLoadingPosts) {
      setIsLoadingPosts(true);
      try {
        const postsData = await getAllPosts(token);
        setPosts(postsData);
      } catch (err) {
        console.error('API error:', err);
      } finally {
        setIsLoadingPosts(false);
      }
    }
  }, []);

  const loadUserPosts = useCallback(async () => {
    const token = getLocalStorageItem('token');
    if (token && !isLoadingUserPosts) {
      setIsLoadingUserPosts(true);
      try {
        const postsData = await getAllUserPosts(token);
        setUserPosts(postsData);
      } catch (err) {
        console.error('API error:', err);
      } finally {
        setIsLoadingUserPosts(false);
      }
    }
  }, []);

  useEffect(() => {
    loadPosts();
    loadUserPosts();
  }, [loadPosts, loadUserPosts]);

  useEffect(() => {
    const postsInterval = setInterval(loadPosts, REFRESH_INTERVAL);
    const userPostsInterval = setInterval(loadUserPosts, REFRESH_INTERVAL);

    return () => {
      clearInterval(postsInterval);
      clearInterval(userPostsInterval);
    };
  }, [loadPosts, loadUserPosts]);

  const handlePostEngaged = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts?.map(post =>
        post.id === postId
          ? { ...post, engaged: 1 }
          : post
      ) || null
    );
  };

  const handleNewPost = (newPost: Post) => {
    if (!userPosts || !posts) return;

    const transformedPost: Post = {
      ...newPost,
      userid: typeof newPost.id === 'string' ? parseInt(newPost.id) : newPost.id,
      engagement_no_reached: 0,
      status: 0
    };

    setUserPosts(prevPosts => [...prevPosts!, transformedPost]);

    const transformedAllPost: AllPost = {
      ...transformedPost,
      id: String(transformedPost.id),
      name: 'User',
      username: 'username',
      img: ImagePlaceholder,
      engagementState: "initial",
      user: {
        fullname: 'User',
        username: 'username',
        id: transformedPost.userid
      },
      engaged: 0
    };

    setPosts(prevPosts => [...prevPosts!, transformedAllPost]);
  };

  const getFilteredPosts = () => {
    if (!posts) return [];

    if (activeType === 'My Posts') {
      return userPosts || [];
    }

    let filteredPosts = [...posts];

    filteredPosts = filteredPosts.filter(post => {
      const isInProgress = postsInProgress[post.id];
      if (isInProgress) {
        return true;
      }
      return activeType === 'Active' ? post.engaged === 0 : post.engaged === 1;
    });

    if (socialFilter !== 'Allsocials') {
      filteredPosts = filteredPosts.filter(post =>
        post.social_platform === socialFilter
      );
    }

    if (nicheFilter) {
      filteredPosts = filteredPosts.filter(post =>
        post.niche === nicheFilter
      );
    }

    return filteredPosts;
  };

  const getCounts = () => {
    if (!posts) return { active: 0, completed: 0, myPosts: 0 };

    const myPostsCount = userPosts ? userPosts.length : 0;
   
    let filteredPosts = [...posts];
   
    if (socialFilter !== 'Allsocials') {
      filteredPosts = filteredPosts.filter(post =>
        post.social_platform === socialFilter
      );
    }

    if (nicheFilter) {
      filteredPosts = filteredPosts.filter(post =>
        post.niche === nicheFilter
      );
    }

    return {
      active: filteredPosts.filter(post => post.engaged === 0).length,
      completed: filteredPosts.filter(post => post.engaged === 1).length,
      myPosts: myPostsCount
    };
  };

  const handleFilterChange = (type: 'social' | 'niche', value: string | number) => {
    if (type === 'social') {
      setSocialFilter(String(value));
    } else {
      setNicheFilter(String(value));
    }
  };

  const handleEngagementStateChange = useCallback((postId: string, state: string) => {
    requestAnimationFrame(() => {
      setPostsInProgress(prev => ({
        ...prev,
        [postId]: state,
      }));
    });
  }, []);

  if (!posts) {
    return <LoadingSpinner />;
  }

  const filteredPosts = getFilteredPosts();
  const counts = getCounts();

  const handlePostCardClick = (post: AllPost | Post) => {
    if (activeType === 'My Posts') {
      // Handle My Posts click logic
      return (
        <AnalyticsCard
          key={post.id}
          {...(post as Post)}
          setIsPopupOpen={setIsPopupOpen}
          setEngagementData={setEngagementData}
        />
      );
    }

    return (
      <PostsCard
        key={post.id}
        {...(post as AllPost)}
        className="col-span-1"
        onEngaged={handlePostEngaged}
        onEngagementChange={handleEngagementStateChange} // Pass handleEngagementStateChange function as a prop
        currentState={postsInProgress[post.id]}
      />
    );
  };

  return (
    <>
      <Overlay isOpen={isAddPost} onClose={() => setIsAddPost(false)}>
        <PostForm
          onClose={() => setIsAddPost(false)}
          onPostSubmitted={handleNewPost}
        />
      </Overlay>
      <BottomPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
        <PostEngagement data={engagementData} />
      </BottomPopup>
      <div className="px-6">
        <section className="flex items-center justify-between">
          <h1 className="text-dark-100 font-semibold text-lg sm:text-xl mb-4">Posts</h1>
          <button
            onClick={() => setIsAddPost(true)}
            className="flex items-center gap-2 sm:gap-4 px-2 sm:px-4 py-1 sm:py-3 rounded-md bg-primary text-white"
          >
            <span className="text-lg sm:text-2xl">+</span>
            <span className="text-sm sm:text-base">Add post</span>
          </button>
        </section>

        <section className="mt-6 gap-4 flex flex-wrap items-center justify-between">
          <PostTypesBar
            postTypes={[
              { label: 'Active', count: counts.active },
              { label: 'Completed', count: counts.completed },
              { label: 'My Posts', count: counts.myPosts },
            ]}
            defaultActive={activeType}
            onPostTypeChange={setActiveType}
          />

          <div className="flex items-center gap-2">
            <h2 className="hidden sm:block">Social</h2>
            <FilterDropdown
              options={[
                { value: 'Allsocials', label: 'All socials' },
                { value: 'Twitter', label: 'Twitter' },
                { value: 'Instagram', label: 'Instagram' },
                { value: 'Tiktok', label: 'Tiktok' },
              ]}
              onSelect={(value) => handleFilterChange('social', value)}
            />
            <h2 className="hidden sm:block">Topic</h2>
            <FilterDropdown
              options={[
                { value: 'Productivity', label: 'Productivity' },
                { value: 'Business', label: 'Business' },
                { value: 'Entrepreneur', label: 'Entrepreneur' },
              ]}
              onSelect={(value) => handleFilterChange('niche', value)}
              placeholder="Select Niche"
            />
          </div>
        </section>

        <section className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts?.length === 0 ? (
              <p>No posts available.</p>
            ) : (
               filteredPosts.map((post) => handlePostCardClick(post)) 
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Posts;