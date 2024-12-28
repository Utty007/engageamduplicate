import React, { useState, useEffect, useRef, useCallback } from 'react';
import InitialsHolder from '@/app/assets/svgs/Avatars.svg';
import Image from 'next/image';
import ImagePlaceholder from "@/app/assets/imgs/placeholder.png";
import Overlay from './Overlay';
import Disclaimer from './Disclaimer';
import axios from 'axios';
import { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem } from '../utils/localStorage';
import { AllPost } from '@/typings';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { engagePost } from '../api/postsApi';

const DISCLAIMER_KEY = 'hasSeenEngagementDisclaimer';

interface PostsCardProps extends AllPost {
  onEngaged?: (postId: string) => void;
  onEngagementChange?: (postId: string, state: string) => void;
  currentState?: string;
  className?: string;
}

const PostsCard = ({
  id,
  img = ImagePlaceholder,
  engagement_type,
  description,
  className,
  user,
  link,
  engaged,
  onEngaged,
  onEngagementChange,
  currentState
}: PostsCardProps) => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const [internalEngagementState, setInternalEngagementState] = useState(
    engaged === 1 ? 'engaged' : 'initial'
  );

  useEffect(() => {
    if (currentState && currentState !== internalEngagementState) {
      setInternalEngagementState(currentState);
    }
  }, [currentState, engaged, internalEngagementState]);

  const handleAuthError = useCallback(() => {
    removeLocalStorageItem('token');
    removeLocalStorageItem('user');
    toast.error('Session expired. Please login again.');
    router.push('/');
  }, [router]);

  const validateToken = useCallback(() => {
    const token = getLocalStorageItem("token");
    if (!token) {
      handleAuthError();
      return false;
    }
    return true;
  }, [handleAuthError]);

  const updateEngagementState = useCallback((newState: string) => {
    if (!validateToken()) return;
    
    setInternalEngagementState(newState);
    onEngagementChange?.(id, newState);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set timer for awaiting state
    if (newState === 'awaiting') {
      setTimeLeft(10);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            updateEngagementState('ready');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [id, onEngagementChange, validateToken]);

  const checkDisclaimerStatus = () => {
    const hasSeenDisclaimer = getLocalStorageItem(DISCLAIMER_KEY);
    return Boolean(hasSeenDisclaimer);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleEngagement = () => {
    if (!validateToken()) return;

    if (internalEngagementState === 'initial' && link) {
      try {
        window.open(link, '_blank', 'noopener,noreferrer');
        updateEngagementState('awaiting');
      } catch (error) {
        toast.error('Failed to open link. Please check your browser settings.' + error);
      }
    } else if (internalEngagementState === 'ready') {
      if (!checkDisclaimerStatus()) {
        setShowDisclaimer(true);
      } else {
        handleEngagementConfirmation();
      }
    }
  };

  const handleEngagementConfirmation = async () => {
    if (!validateToken()) return;
   
    const token = getLocalStorageItem("token");
    const toastId = toast.loading('Processing engagement...');
   
    try {
      await engagePost(id, token!);
      updateEngagementState('engaged');
      onEngaged?.(id);
      toast.success('Successfully engaged with post!', { id: toastId });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.dismiss(toastId);
          handleAuthError();
          return;
        }
        toast.error(error.response?.data?.message || 'Failed to engage with post', { id: toastId });
      } else {
        toast.error('An unexpected error occurred', { id: toastId });
      }
      console.error('Error submitting engagement:', error);
      updateEngagementState('ready');
    }
  };

  const handleDisclaimerConfirm = () => {
    setLocalStorageItem(DISCLAIMER_KEY, 'true');
    setShowDisclaimer(false);
    handleEngagementConfirmation();
  };

  const getButtonConfig = () => {
    switch (internalEngagementState) {
      case 'awaiting':
        return {
          text: `Awaiting engagement (${timeLeft}s)`,
          disabled: true,
          className: 'bg-gray-500'
        };
      case 'ready':
        return {
          text: 'Confirm Engagement',
          disabled: false,
          className: 'bg-primary'
        };
      case 'engaged':
        return {
          text: 'Completed',
          disabled: true,
          className: 'bg-gray-500'
        };
      default:
        return {
          text: 'Engage Post',
          disabled: false,
          className: 'bg-primary'
        };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <div className={`w-full box-border p-3 sm:p-6 rounded-md border border-grey-stroke flex flex-col items-start gap-4 ${className}`}>
      <div className="flex items-center gap-2">
        <InitialsHolder />
        <div className="flex flex-col gap-1">
          <h2 className="text-dark-100 font-bold">{user.fullname}</h2>
          <span className="text-gray-400 text-sm">@{user.username}</span>
        </div>
      </div>

      <p className="text-greyBase text-sm">{description}</p>
      <Image src={img} alt="Placeholder" className="w-full" />
      <p className="text-greyBase text-sm">Requested: {engagement_type}</p>

      <button
        className={`flex items-center justify-center w-full p-2 gap-2 rounded-md ${buttonConfig.className} text-white transition-colors duration-200`}
        onClick={handleEngagement}
        disabled={buttonConfig.disabled}
      >
        {buttonConfig.text}
      </button>

      {showDisclaimer && (
        <Overlay isOpen={showDisclaimer} onClose={() => setShowDisclaimer(false)}>
          <Disclaimer
            onClose={() => setShowDisclaimer(false)}
            title="Note"
            description="Please note that falsely claiming to have engaged with posts may result in consequences."
            affirmation="By clicking &quot;I Understand&quot;, you confirm that you have genuinely engaged with this post."
            underStdBtn={handleDisclaimerConfirm}
          />
        </Overlay>
      )}
    </div>
  );
};

export default PostsCard;