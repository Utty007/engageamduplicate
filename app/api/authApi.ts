import axios from 'axios';
import { apiClient } from './axiosClient';
import { getLocalStorageItem } from '../utils/localStorage';

export interface ResponseStructure {
  success: boolean;
  message: string;
  data: {
    token: string;
    email: string;
    firstname: string;
    lastname: string;
    login: string;
    status: number;
    balance: string;
    account_notification?: number;
    product_update_notification?: number;
    promotional_email_notification?: number;
    tips_notification?: number;
    survey_notification?: number;
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
  };
}

interface SignUpCredentials {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface VerifyOTPCredentials {
  otp: string;
}

interface VerifyForgottenOTPCredentials {
  otp: string;
  email: string | null;
}

interface RegisterUserDetails {
  occupation: string;
  twitter: string;
  tiktok: string;
  instagram: string;
}

interface SendForgottenOtpCredentials {
  email: string | null;
}

interface CreatePasswordCrendentials {
  new_password: string;
  confirm_password: string;
  email: string | null;
}



export const createUser = async (
  userData: SignUpCredentials,
): Promise<ResponseStructure> => {
  try {
    const response = await apiClient.post<ResponseStructure['data']>(
      '/auth/register.php',
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

export const loginUser = async (
  userData: LoginCredentials,
): Promise<ResponseStructure> => {
  try {
    const response = await apiClient.post<ResponseStructure['data']>(
      '/auth/login.php',
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

export const sendOTP = async (
  userData: SendForgottenOtpCredentials,
): Promise<ResponseStructure> => {
  const token = getLocalStorageItem('token');

  try {
    const response = await apiClient.post<ResponseStructure['data']>(
      `/auth/sendOTP.php?token=${token}`,
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

export const verifyOTP = async (
  otpData: VerifyOTPCredentials,
): Promise<ResponseStructure> => {
  const token = getLocalStorageItem('token');

  try {
    const response = await apiClient.post<ResponseStructure['data']>(
      `/auth/verifyOTP.php?token=${token}`,
      otpData,
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

export const registerUserDetails = async (
  userData: RegisterUserDetails,
): Promise<ResponseStructure> => {
  const token = getLocalStorageItem('token');

  try {
    const response = await apiClient.post<ResponseStructure['data']>(
      `/auth/register2.php?token=${token}`,
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

export const sendForgottenOTP = async (
  userData: SendForgottenOtpCredentials,
): Promise<ResponseStructure> => {
  try {
    const response = await apiClient.post<ResponseStructure['data']>(
      '/auth/sendForgottenOTP.php',
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

export const verifyForgottenOTP = async (
  userData: VerifyForgottenOTPCredentials,
): Promise<ResponseStructure> => {
  try {
    const response = await apiClient.post<ResponseStructure['data']>(
      '/auth/verifyForgottenOTP.php',
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

export const createPassword = async (
  userData: CreatePasswordCrendentials,
): Promise<ResponseStructure> => {
  try {
    const response = await apiClient.post<ResponseStructure['data']>(
      'auth/updatePassword.php',
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


