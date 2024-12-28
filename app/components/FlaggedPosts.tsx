"use client"

import React, { useState, useMemo, ReactElement, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EvidenceModal from './EvidenceModal';
import TwitterIcon from "@/app/assets/svgs/X.svg";
import InstagramIcon from "@/app/assets/svgs/instagram.svg";
import TikTokIcon from "@/app/assets/svgs/tiktok.svg";
import Warning from './Warning';
import LoadingSpinner from './LoadingSpinner';
import { getLocalStorageItem } from '@/app/utils/localStorage';
import toast from 'react-hot-toast';

interface User {
  id: number;
  username: string;
  fullname: string;
  instagram: string;
  tiktok: string;
  twitter: string;
}

interface Post {
  id: number;
  title: string;
  description: string;
  social_platform: string;
  engagement_type: string;
}

interface FlaggedEngagement {
  id: number;
  userid: number;
  postid: number;
  date_created: string;
  status: number;
  status_code: string;
  status_engager: string;
  status_poster: string;
  flagged: number;
  role: string;
  user: User;
  post: Post;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: FlaggedEngagement[];
}

function FlaggedPosts() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<FlaggedEngagement[]>([]);
  const [isWarningOpen, setIsWarningOpen] = useState<boolean>(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<FlaggedEngagement | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchFlaggedEngagements = async () => {
    const token = getLocalStorageItem("token");
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    try {
      const response = await fetch(
        `https://engageam.app/dashboard_php/posts/getFlaggedEngagments.php?token=${token}&postid=14`
      );
      const result: ApiResponse = await response.json();

      if (result.success) {
        setData(result.data);
        console.log(result.data)
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to fetch flagged engagements' + error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlaggedEngagements();
  }, []);

  const updateEngagementStatus = async (
    engagementId: number,
    postId: string,
    role: string,
    statusEngager: string,
    statusPoster: string
  ) => {
    const token = getLocalStorageItem("token");
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    setUpdatingId(engagementId);

    try {
      const response = await fetch(
        `https://engageam.app/dashboard_php/posts/updateFlaggedEngagements.php?token=${token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            engagmentid: engagementId.toString(),
            postid: postId,
            role: role,
            status_engager: statusEngager.toLowerCase(),
            status_poster: statusPoster.toLowerCase()
          })
        }
      );

      console.log(engagementId, postId, role, statusEngager, statusPoster)

      const result = await response.json();
      console.log(result)

      if (result.success) {
        toast.success(result.message);
        await fetchFlaggedEngagements();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to update engagement status' + error);
    } finally {
      setUpdatingId(null);
    }
  };

  const getSocialIcon = (platform: string): ReactElement => {
    switch (platform.toLowerCase()) {
      case 'twitter':
        return <TwitterIcon />;
      case 'instagram':
        return <InstagramIcon />;
      case 'tiktok':
        return <TikTokIcon />;
      default:
        return <TwitterIcon />;
    }
  };

  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const headers = useMemo(() => [
    {key: "username", label: "Username"},
    {key: "type", label: "Type"},
    {key: 'Profile', label: 'Profile'},
    {key: 'viewpost', label: 'View Post'},
    {key: 'status', label: 'Status'},
    {key: 'action', label: 'Action'},
  ], []);

  const renderStatus = (engagement: FlaggedEngagement) => {
    let statusClasses = "text-xs font-bold w-fit p-1 rounded-md ";
    let status;

    if (engagement.role === "Poster") {
      status = engagement.status_poster.toLowerCase()
    } else if (engagement.role === "Engager") {
      status = engagement.status_engager.toLowerCase()
    };
    
    switch(status) {
      case "pending correction from engager":
      case "pending correction from you":
        statusClasses += "bg-red-secondary text-red-500";
        break;
      case "fixed: awaiting verification from you":
      case "fixed: awaiting verification":
        statusClasses += "bg-grey-100 text-grey-base";
        break;
      case "fixed":
        statusClasses += "bg-green-500 text-white";
        break;
      case "dispute raised":
        statusClasses += "bg-yellow-500 text-white";
        break;
      default:
        statusClasses += "bg-grey-100 text-grey-base";
    }
    
    return <h4 className={statusClasses}>{status}</h4>;
  };

  const handleWarningOpen = () => {
    setIsWarningOpen(true);
  };

  const handleWarningClose = () => {
    setIsWarningOpen(false);
  };

  const handleConfirmation = async (engagement: FlaggedEngagement) => {
    await updateEngagementStatus(
      engagement.id,
      engagement.postid.toString(),
      engagement.role,
      "fixed: awaiting verification",
      "fixed: awaiting verification from you",
    );
    handleWarningClose();
  };

  const renderActionButton = (engagement: FlaggedEngagement) => {
    if (updatingId === engagement.id) {
      return <LoadingSpinner />;
    }

    let status;

    if (engagement.role === "Poster") {
      status = engagement.status_poster.toLowerCase()
    } else if (engagement.role === "Engager") {
      status = engagement.status_engager.toLowerCase()
    };

    switch(status) {
      case "pending correction from you":
        return (
          <>
            <button
              className='text-sm bg-primary p-2 text-white rounded-md'
              onClick={() => {
                setSelectedPost(engagement);
                handleWarningOpen();
              }}
            >
              Issue Fixed
            </button>

            <Warning
              confirm={() => {
                if (selectedPost) {
                  handleConfirmation(selectedPost);
                }
              }}
              isOpen={isWarningOpen}
              onClose={handleWarningClose}
              title='Warning'
              description='Kindly ensure that you have genuinely engaged this post.'
              affirmation="Claiming to have engaged when you haven't can lead to points deductions and having your account suspended."
            />
          </>
        );

      case "fixed: awaiting verification from you":
        return (
          <div className="flex space-x-2">
            <button 
              className='text-sm bg-primary p-2 text-white rounded-md'
              onClick={() => updateEngagementStatus(
                engagement.id,
                engagement.postid.toString(),
                engagement.role,
                "fixed",
                "fixed"
              )}
            >
              Verify Fix
            </button>
            <button 
              className='text-sm bg-red-500 p-2 text-white rounded-md'
              onClick={() => {
                setSelectedPost(engagement);
                setIsEvidenceModalOpen(true);
              }}
            >
              Raise Dispute
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const handleUploadEvidence = async (file: File | null, description: string) => {
  if (!selectedPost || !file) {
    toast.error('Please provide both evidence and description');
    return;
  }

  const token = getLocalStorageItem("token");
  if (!token) {
    toast.error("Authentication token not found");
    return;
  }

  const toastId = toast.loading('Processing dispute...');

  try {
    // First update the engagement status
    await updateEngagementStatus(
      selectedPost.id,
      selectedPost.postid.toString(),
      selectedPost.role,
      "dispute raised",
      "dispute raised"
    );

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('evidence', file);
    formData.append('engagementid', selectedPost.id.toString());
    formData.append('postid', selectedPost.postid.toString());
    formData.append('details', description);

    const response = await fetch(
      `https://engageam.app/dashboard_php/posts/raiseDispute.php?token=${token}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();

    if (result.success) {
      toast.success('Dispute raised successfully', { id: toastId });
    } else {
      throw new Error(result.message || 'Failed to raise dispute');
    }

    setIsEvidenceModalOpen(false);
    setSelectedPost(null);
    
  } catch (error) {
    console.error('Error raising dispute:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to raise dispute', { id: toastId });
  }
};

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full max-w-full px-4 sm:px-3 lg:px-5">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-dark-100 font-semibold text-xl mb-2">Flagged Engagements</h1>
          <p className="text-gray-400 text-sm">Engagements that have been flagged and require attention</p>
        </div>

        {data.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No engagements flagged
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="min-w-[1000px] w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {headers.map((header) => (
                    <th 
                      key={header.key} 
                      className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((engagement, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-3 border-b text-sm text-grey-base whitespace-nowrap">
                      {engagement.user.username}
                    </td>
                    <td className="p-3 border-b text-sm text-grey-base whitespace-nowrap">
                      {engagement.post.engagement_type}
                    </td>
                    <td className='p-3 border-b whitespace-nowrap'>
                      {getSocialIcon(engagement.post.social_platform)}
                    </td>
                    <td className="p-3 border-b text-sm text-grey-base underline">
                      {engagement.post.title}
                    </td>
                    <td className="p-3 border-b text-sm text-grey-base capitalize">
                      {renderStatus(engagement)}
                    </td>
                    <td className="p-3 border-b text-sm text-grey-base">
                      {renderActionButton(engagement)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between items-center">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-md disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="ml-2 block">Previous</span>
            </button>

            <div className="flex space-x-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-8 h-8 rounded-md text-sm ${
                    currentPage === index + 1 
                      ? 'bg-primary/80 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-md disabled:opacity-50"
            >
              <span className="mr-2 block">Next</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <EvidenceModal
        describe='When you raise a dispute, both parties are to present informtion about said dispute and an admin reviews the dispute for proper resolution.'
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        onSubmit={handleUploadEvidence}
      />
    </div>
  );
}

export default FlaggedPosts;