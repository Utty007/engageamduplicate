import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getUser } from '../api/dashboardApi';
import { UserData } from '@/typings';
import { getLocalStorageItem, setLocalStorageItem } from '../utils/localStorage';

const token = getLocalStorageItem("token")

interface UserState {
  user: UserData | null;
  fetchUser: () => Promise<void>;
}
export const useUserStore = create<UserState>()(
  devtools((set) => ({
    user: null,
    fetchUser: async () => {
      if (token) {
        try {
          const userData = await getUser(token);
          set({ user: userData });
          // Update localStorage with fresh data
          setLocalStorageItem('userData', JSON.stringify(userData));
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      }
    },
  }))
);