import React, { useState } from 'react';
import axios from 'axios';
import FilterDropdown from './FilterDropdown';
import { getLocalStorageItem } from '../utils/localStorage';
import { Post } from '@/typings';
import LoadingSpinner from './LoadingSpinner';
import toast from 'react-hot-toast';
import { useUserStore } from '../stores/useUserStore';

interface FormData {
  title: string;
  description: string;
  social_platform: string;
  niche: string;
  link: string;
  engagement_type: string;
  engagement_no: string;
}

type PostFormProps = {
  onClose: () => void;
  onPostSubmitted: (post: Post) => void;
};

const token = getLocalStorageItem("token")

function PostForm({ onClose, onPostSubmitted }: PostFormProps) {
  const user = useUserStore(user => user.user)
  const AVAILABLE_POINTS = user ? parseInt(user.balance, 10) : 0;
  const BASE_URL = 'https://engageam.app/dashboard_php/posts';

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    social_platform: '',
    niche: '',
    link: '',
    engagement_type: '',
    engagement_no: '',
  });

  const [errors, setErrors] = useState<Record<keyof FormData, string>>({
    title: '',
    description: '',
    social_platform: '',
    niche: '',
    link: '',
    engagement_type: '',
    engagement_no: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleFilterChange = (value: string | number, field: string) => {
    const stringValue = value.toString();
    setFormData((prev) => ({
      ...prev,
      [field]: stringValue,
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: Record<keyof FormData, string> = {
      title: '',
      description: '',
      social_platform: '',
      niche: '',
      link: '',
      engagement_type: '',
      engagement_no: '',
    };

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    if (!formData.social_platform) {
      newErrors.social_platform = 'Please select a social platform';
      isValid = false;
    }

    if (!formData.niche) {
      newErrors.niche = 'Please select a niche';
      isValid = false;
    }

    if (!formData.link.trim()) {
      newErrors.link = 'Link is required';
      isValid = false;
    } else if (!/^https?:\/\/.*/.test(formData.link)) {
      newErrors.link = 'Please enter a valid URL starting with http:// or https://';
      isValid = false;
    }

    if (!formData.engagement_type) {
      newErrors.engagement_type = 'Please select an engagement type';
      isValid = false;
    }

    if (!formData.engagement_no) {
      newErrors.engagement_no = 'Please select number of engagements';
      isValid = false;
    } else {
      const requiredPoints = parseInt(formData.engagement_no, 10) * 2;
      if (requiredPoints > AVAILABLE_POINTS) {
        newErrors.engagement_no = `Insufficient points. You have ${AVAILABLE_POINTS} points.`;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const submitPost = async () => {
  if (!token) return;
  
  try {
    const response = await axios.post(`${BASE_URL}/newPost.php`, formData, {
      params: { token }
    });

    if (response.data.success) {
      const newPost: Post = {
        id: response.data.id,
        userid: 0, // Replace with actual user ID
        title: formData.title,
        description: formData.description,
        social_platform: formData.social_platform,
        niche: formData.niche,
        link: formData.link,
        engagement_type: formData.engagement_type,
        engagement_no: parseInt(formData.engagement_no),
        engagement_no_reached: 0,
        status: 0,
        date_created: new Date().toISOString()
      };
      
      onPostSubmitted(newPost);
      toast.success(response.data.message)
      onClose();
    } else {
      toast.error(response.data.message)
      throw new Error(response.data.message || 'Failed to submit post');
    }
  } catch (error) {
    console.error('Error submitting post:', error);
    throw error;
  }
};

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await submitPost();
      } catch (error) {
        console.error('Error submitting post:', error);
        // Handle error (show error message to user)
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="bg-white text-black h-fit p-4 rounded-md w-full sm:w-[600px]">
      <h2 className="text-dark-100 font-bold">Submit a post</h2>
      <div className="flex flex-col mt-6 gap-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter Title"
          className={`border ${errors.title ? 'border-red-500' : 'border-grey-stroke'} p-2 rounded-md outline-none`}
        />
        {errors.title && (
          <span className="text-red-500 text-xs">{errors.title}</span>
        )}

        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter a Description..."
          className={`border ${errors.description ? 'border-red-500' : 'border-grey-stroke'} p-2 rounded-md outline-none`}
        />
        {errors.description && (
          <span className="text-red-500 text-xs">{errors.description}</span>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="col-span-1">
            <label htmlFor="social_platform" className="text-sm font-medium">
              Social Platform
            </label>
            <FilterDropdown
              options={[
                { value: 'Tiktok', label: 'TikTok' },
                { value: 'Twitter', label: 'Twitter' },
                { value: 'Instagram', label: 'Instagram' },
              ]}
              onSelect={(value) => handleFilterChange(value, 'social_platform')}
            />
            {errors.social_platform && (
              <span className="text-red-500 text-xs">{errors.social_platform}</span>
            )}
          </div>
          <div className="col-span-1">
            <label htmlFor="niche" className="text-sm font-medium">
              Niche
            </label>
            <FilterDropdown
              options={[
                { value: 'Productivity', label: 'Productivity' },
                { value: 'Business', label: 'Business' },
                { value: 'Entrepreneur', label: 'Entrepreneur' },
              ]}
              onSelect={(value) => handleFilterChange(value, 'niche')}
              placeholder="Select Niche"
            />
            {errors.niche && (
              <span className="text-red-500 text-xs">{errors.niche}</span>
            )}
          </div>
        </div>

        <label htmlFor="link" className="text-sm font-medium">
          Content Link
        </label>
        <input
          type="text"
          name="link"
          value={formData.link}
          onChange={handleInputChange}
          placeholder="https://example.com"
          className={`border ${errors.link ? 'border-red-500' : 'border-grey-stroke'} p-2 rounded-md outline-none`}
        />
        {errors.link && (
          <span className="text-red-500 text-xs">{errors.link}</span>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <label htmlFor="engagement_type" className="text-sm font-medium">
              Engagement Type
            </label>
            <FilterDropdown
              options={[
                { value: 'Like', label: 'Like' },
                { value: 'Comment', label: 'Comment' },
                { value: 'Repost', label: 'Repost' },
                { value: 'Follow', label: 'Follow' },
              ]}
              onSelect={(value) => handleFilterChange(value, 'engagement_type')}
              placeholder="Select Engagement Type"
            />
            {errors.engagement_type && (
              <span className="text-red-500 text-xs">{errors.engagement_type}</span>
            )}
          </div>
          <div className="col-span-1">
            <label htmlFor="engagement_no" className="text-sm font-medium">
              Number of Engagements
            </label>
            <FilterDropdown
              options={[
                { value: '50', label: '50 (100 points)' },
                { value: '100', label: '100 (200 points)' },
                { value: '200', label: '200 (400 points)' },
                { value: '500', label: '500 (1000 points)' },
                { value: '1000', label: '1000 (2000 points)' },
              ]}
              onSelect={(value) => handleFilterChange(value, 'engagement_no')}
              placeholder="Select Number"
            />
            {errors.engagement_no && (
              <span className="text-red-500 text-xs">{errors.engagement_no}</span>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-600 mt-2">
          Available Points: {AVAILABLE_POINTS}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          type="button"
          className="px-4 py-3 rounded-md bg-primary text-white w-fit mt-4 disabled:opacity-50"
        >
          {isSubmitting ? <LoadingSpinner /> : 'Submit Post'}
        </button>
      </div>
    </div>
  );
}

export default PostForm;