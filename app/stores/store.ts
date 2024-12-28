// store.ts
import { create } from 'zustand';
import { Post, AllPost } from '@/typings';

interface StoreState {
  userPosts: Post[];
  allPosts: AllPost[] | null;
  lastFetchedAt: number | null;
  isLoading: boolean;
  setUserPosts: (posts: Post[]) => void;
  setAllPosts: (posts: AllPost[]) => void;
  setLastFetchedAt: (timestamp: number) => void;
  setIsLoading: (loading: boolean) => void;
  updatePostEngagement: (postId: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  userPosts: [],
  allPosts: null,
  lastFetchedAt: null,
  isLoading: false,
  setUserPosts: (posts) => set({ userPosts: posts }),
  setAllPosts: (posts) => set({ allPosts: posts }),
  setLastFetchedAt: (timestamp) => set({ lastFetchedAt: timestamp }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  updatePostEngagement: (postId) => set((state) => ({
    allPosts: state.allPosts?.map(post => 
      post.id === postId ? { ...post, engaged: 1 } : post
    ) || null
  }))
}));