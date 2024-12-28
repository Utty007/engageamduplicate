/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import Flag from '@/app/assets/svgs/flag-white.svg';
import { Engagement } from '@/typings';
import { getLocalStorageItem } from '@/app/utils/localStorage';
import toast from 'react-hot-toast';
import axios from 'axios';
import useLoading from '../hooks/useLoading';
import LoadingSpinner from './LoadingSpinner';
import TableSkeleton from './TableSkeleton';
import { getEngagementPerPost } from '../api/postApi';

interface PostEngagementProps {
  data?: Engagement[];
  id?: string | number;
}

interface FlagResponse {
  success: boolean;
  message: string;
  data: Record<string, any>;
}

interface PostsDataProps {
  post: {
    engagement_type: string;
  };
  status_code: string;
  id: number;
  user: {
    username: string;
  };
}

const PostEngagement = ({ data, id }: PostEngagementProps) => {
  const [flaggingIds, setFlaggingIds] = useState<Set<number>>(new Set());
  const [postsData, setPostsData] = useState<PostsDataProps[]>([]);
  const { isLoading, hideLoader, showLoader } = useLoading();

  const handleFlag = async (engagementId: number, postId: number) => {
    const token = getLocalStorageItem('token');
    if (!token) {
      toast.error('Authentication token not found');
      return;
    }

    setFlaggingIds((prev) => new Set(prev).add(engagementId));

    try {
      const response = await fetch(
        `https://engageam.app/dashboard_php/posts/flagEngagement.php?token=${token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            engagmentid: engagementId.toString(),
            postid: postId.toString(),
          }),
        }
      );

      const result: FlagResponse = await response.json();

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to flag engagement: ' + error);
    } finally {
      setFlaggingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(engagementId);
        return newSet;
      });
    }
  };

useEffect(() => {
  let isMounted = true;

  if (id) {
    const fetchPostsEngagement = async () => {
      if (!isLoading) {
        showLoader();
      }

      try {
        const response = await getEngagementPerPost(id);
        
        // Only proceed if component is still mounted
        if (!isMounted) return;

        if (response.success) {
          if (Array.isArray(response.data)) {
            setPostsData(response.data);
            // Only show success toast after data is set
            toast.success(response.message);
          }
        }
      } catch (error) {
        if (!isMounted) return;

        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || 'Fetching post engagement failed'
          );
        } else {
          // Remove the concatenation to avoid [object Object] in error message
          toast.error('An error occurred while fetching post engagement');
        }
        
        // Log the full error for debugging
        console.error('Post engagement error:', error);
      } finally {
        if (isMounted) {
          hideLoader();
        }
      }
    };

    fetchPostsEngagement();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }
}, []);

  const renderTableRows = (items: any[]) => {
    return items.map((item) => (
      <tr key={item.id} className="hover:bg-gray-50">
        <td className="p-3 border-b text-grey-base">
          {item.user?.username || item.engager_data?.username}
        </td>
        <td className="p-3 border-b text-grey-base">
          {item.post?.engagement_type || item.post_data?.engagement_type}
        </td>
        <td className="p-3 border-b text-grey-base">
          <p className="bg-[#ECECED] w-fit px-2 py-1 text-grey-base rounded-[16px] font-semibold text-xs">
            {item.status_code}
          </p>
        </td>
        <td className="p-3 border-b text-grey-base">
          <button
            className="border border-[#353438] text-dark-400 font-normal text-sm p-2 rounded-md"
            onClick={() => handleFlag(item.id, item.postid)}
            disabled={flaggingIds.has(item.id) || item.flagged === 1}
          >
            {item.flagged === 0 ? (
              flaggingIds.has(item.id) ? (
                <LoadingSpinner />
              ) : (
                <span className="flex items-center gap-2">
                  <Flag />
                  Flag
                </span>
              )
            ) : (
              <span className="flex items-center gap-2">
                <Flag />
                Flagged
              </span>
            )}
          </button>
        </td>
      </tr>
    ));
  };

  if (!data && !id) {
    return <div className="p-4">No engagements found.</div>;
  }

  return (
    <div className="px-5 md:px-10 lg:px-10 flex flex-col gap-6">
      <div className="flex gap-2 items-center">
        <h1 className="text-dark-100 font-semibold text-xl">Post Engagements</h1>
      </div>

      {id && isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="w-full rounded-lg overflow-x-auto">
          {(data && data.length > 0) || postsData.length > 0 ? (
            <table className="w-full border-grey-stroke border rounded-md">
              <thead>
                <tr>
                  <th className="p-3 text-left border-b">Username</th>
                  <th className="p-3 text-left border-b">Type</th>
                  <th className="p-3 text-left border-b">Status</th>
                  <th className="p-3 text-left border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {renderTableRows(data || postsData)}
              </tbody>
            </table>
          ) : (
            <p className="text-2xl text-center">No Engagements Found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PostEngagement;
