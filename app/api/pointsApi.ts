import axios from 'axios';

// Define the base URL for your API
const BASE_URL = 'https://engageam.app/dashboard_php/points';

export const getAllPlans = async (token: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/getPlans.php`, {
      params: {
        token: token
      }
    });

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Error fetching plans');
    }
  } catch (error) {
    console.error('There was an error fetching plans:', error);
    throw error;
  }
};
