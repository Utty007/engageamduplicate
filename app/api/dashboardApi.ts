import axios from 'axios';

// Define the base URL for your API
export const getUser = async (token: string) => {
  const BASE_URL = 'https://engageam.app/dashboard_php/user';
  try {
    const response = await axios.get(`${BASE_URL}/getUser.php`, {
      params: {
        token: token
      }
    });

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Error fetching user data');
    }
  } catch (error) {
    console.error('There was an error fetching user data:', error);
    throw error;
  }
};

// Define the base URL for your API

export const getAllUserPosts = async (token: string) => {
  const BASE_URL = 'https://engageam.app/dashboard_php/posts';
  try {
    const response = await axios.get(`${BASE_URL}/getUserPosts.php`, {
      params: {
        token: token
      },
      headers: {
        'Authorization': `Bearer ${token}` // Try adding token in headers as well
      }
    });

    if (response.data.success) {
      if (!response.data.data || response.data.data.length === 0) {
        return [];
      }
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Error fetching posts');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
    console.error('There was an error fetching posts:', error);
    throw error;
  }
};
