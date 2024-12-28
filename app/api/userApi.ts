import axios from 'axios';
import { getLocalStorageItem } from '../utils/localStorage';
import { apiClient } from './axiosClient';
import { ResponseStructure } from './authApi';

interface UpdatePasswordCrendentials {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

interface UpdateProfileCredentials {
  firstname?: string;
  lastname?: string;
  account_notification?: number;
  product_update_notification?: number;
  promotional_email_notification?: number;
  tips_notification?: number;
  survey_notification?: number;
}

export const updateProfile = async (
  userData: UpdateProfileCredentials,
): Promise<ResponseStructure> => {
  const token = getLocalStorageItem('token');
  try {
    const response = await apiClient.post<ResponseStructure['data']>(
      `/user/updateProfile.php?token=${token}`,
      userData,
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

export const getUser = async (): Promise<ResponseStructure> => {
  const token = getLocalStorageItem('token');
  try {
    const response = await apiClient.get<ResponseStructure['data']>(
      `/user/getUser.php?token=${token}`,
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

export const updatePassword = async (
  userData: UpdatePasswordCrendentials,
): Promise<ResponseStructure> => {
  const token = getLocalStorageItem('token');
  try {
    const response = await apiClient.post<ResponseStructure['data']>(
      `/user/updatePassword.php?token=${token}`,
      userData,
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};
