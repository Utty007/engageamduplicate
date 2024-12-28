import axios from 'axios';
import { ResponseStructure } from './authApi';
import { apiClient } from './axiosClient';
import { getLocalStorageItem } from '../utils/localStorage';

export const getUserPosts = async (): Promise<ResponseStructure> => {
  const token = getLocalStorageItem('token');
  try {
    const response = await apiClient.get<ResponseStructure['data']>(
      `/posts/getUserPosts.php?token=${token}`,
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

export const getEngagementPerPost = async (
  id: string | number,
): Promise<ResponseStructure> => {
  const token = getLocalStorageItem('token');
  try {
    const response = await apiClient.get<ResponseStructure['data']>(
      `/posts/getEngagers.php?token=${token}&postid=${id}`,
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};
