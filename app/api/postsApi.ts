import axios from 'axios';

const BASE_URL = 'https://engageam.app/dashboard_php/posts';

export const getAllPosts = async (token: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/getAllPosts.php`, {
      params: {
        token: token
      }
    });

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Error fetching posts');
    }
  } catch (error) {
    console.error('There was an error fetching posts:', error);
    throw error;
  }
};

export const engagePost = async (postId: string, token: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/engagePost.php`,
      { postid: postId }, // Request body
      { params: { token } } // Query parameters
    );

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Error engaging with post');
    }
  } catch (error) {
    console.error('Error details:', error);
    throw error;
  }
};
