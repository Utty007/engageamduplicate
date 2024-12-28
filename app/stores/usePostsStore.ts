import { create } from 'zustand';
import ImagePlaceholder from '@/app/assets/imgs/placeholder.png';
import { StaticImageData } from 'next/dist/shared/lib/get-img-props';

type EngagementState = 'initial' | 'awaiting' | 'engaged' | 'completed';
type PostStatus = 'active' | 'completed';

export interface Post {
  id: string;
  name: string;
  username: string;
  img: StaticImageData;
  comment: string;
  request: string;
  status: PostStatus;
  link?: string;
  engagementState: EngagementState;
  engagementTimestamp?: number;
  social_platform?: string;
  niche?: string;
}

interface engagementTypeProps {
  title: string;
  amount: number
}

export interface engagementListItems {
  id: number;
  name: string;
  username: string;
  title: string;
  socialText: string;
  engagementText: string;
  engagementType: engagementTypeProps[]
  data: [{
    username: string;
    status: "completed";
    type: string;
  }]
}

interface PostsState {
  posts: Post[];
  yourPosts: Post[];
  hasSeenDisclaimer: boolean;
}

interface PostsActions {
  setHasSeenDisclaimer: () => void;
  updatePostStatus: (postId: string, status: PostStatus) => void;
  updatePostEngagementState: (postId: string, state: EngagementState) => void;
  getFilteredPosts: (status: string) => Post[];
  getPostCounts: () => { active: number; completed: number; myPosts: number };
  addPost: (post: Post) => void;
  engagementList: engagementListItems[];
}

type PostsStore = PostsState & PostsActions;

export const usePostsStore = create<PostsStore>()((set, get) => ({
  posts: [
    {
      id: '1',
      name: 'Jane Smith',
      username: 'Username',
      img: ImagePlaceholder,
      comment: 'View my latest post',
      request: 'Comment',
      status: 'active',
      link: 'https://example.com/post1',
      engagementState: 'initial',
    },
    {
      id: '2',
      name: 'John Doe',
      username: 'JohnD',
      img: ImagePlaceholder,
      comment: 'Check out this update',
      request: 'Like',
      status: 'completed',
      link: 'https://example.com/post2',
      engagementState: 'completed',
    },
  ],
  yourPosts: [
    {
      id: 'y1',
      name: 'Your Name',
      username: 'YourHandle',
      img: ImagePlaceholder,
      comment: 'My latest update',
      request: 'Follow',
      status: 'active',
      link: 'https://example.com/yourpost1',
      engagementState: 'initial',
    },
  ],
  hasSeenDisclaimer: false,

  setHasSeenDisclaimer: () => set({ hasSeenDisclaimer: true }),

  updatePostStatus: (postId, status) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, status } : post,
      ),
    })),

  updatePostEngagementState: (postId, engagementState) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, engagementState } : post,
      ),
    })),

  getFilteredPosts: (status) => {
    const state = get();
    if (status === 'My Posts') return state.yourPosts;
    return state.posts.filter(
      (post) => post.status.toLowerCase() === status.toLowerCase(),
    );
  },

  getPostCounts: () => {
    const state = get();
    return {
      active: state.posts.filter((post) => post.status === 'active').length,
      completed: state.posts.filter((post) => post.status === 'completed')
        .length,
      myPosts: state.yourPosts.length,
    };
  },

  addPost: (post) =>
    set((state) => ({
      yourPosts: [...state.yourPosts, post],
      posts: [...state.posts, post],
  })),
  
  engagementList: [
  {
    id: 100,
    name: 'Jane Smith',
    username: '@userAS',
    title: 'Weekend getaway vlog',
    socialText: 'Watch on Youtube',
    engagementText: 'Subscribe & Like',
    engagementType: [
      {
        title: 'Subscribers',
        amount: 90,
      },
      {
        title: 'Likes',
        amount: 40,
      },
    ],
    data: [{
      username: "Skylar_20",
      status: "completed",
      type: "like and comment."
    }]
  },
  {
    id: 101,
    name: 'Jane Smith',
    username: '@userTS',
    title: 'Exploring the great outdoors',
    socialText: 'Explore on Twitter',
    engagementText: 'Retweet & Reply',
    engagementType: [
      {
        title: 'Retweets',
        amount: 45,
      },
      {
        title: 'Replies',
        amount: 12,
      },
    ],
    data: [{
      username: "Skylar_20",
      status: "completed",
      type: "like and comment."
    }]
  },
  {
    id: 102,
    name: 'Jane Smith',
    username: '@userMD',
    title: 'Trying out new recipes',
    socialText: 'Recipes on Pinterest',
    engagementText: 'Follow',
    engagementType: [
      {
        title: 'Saves',
        amount: 30,
      },
      {
        title: 'Follow',
        amount: 30,
      }
    ],
    data: [{
      username: "Skylar_20",
      status: "completed",
      type: "like and comment."
    }]
  },
  {
    id: 103,
    name: 'Jane Smith',
    username: '@userAS',
    title: 'Weekend getaway vlog',
    socialText: 'Watch on Youtube',
    engagementText: 'Subscribe & Like',
    engagementType: [
      {
        title: 'Subscribers',
        amount: 90,
      },
      {
        title: 'Likes',
        amount: 40,
      },
    ],
    data: [{
      username: "Skylar_20",
      status: "completed",
      type: "like and comment."
    }]
  },
  {
    id: 104,
    name: 'Jane Smith',
    username: '@Utty007',
    title: 'Exploring the great outdoors',
    socialText: 'Explore on Twitter',
    engagementText: 'Retweet & Reply',
    engagementType: [
      {
        title: 'Retweets',
        amount: 45,
      },
      {
        title: 'Replies',
        amount: 12,
      },
    ],
    data: [{
      username: "Skylar_20",
      status: "completed",
      type: "like and comment."
    }]
  },
  {
    id: 105,
    name: 'Jane Smith',
    username: '@userMD',
    title: 'Trying out new recipes',
    socialText: 'Recipes on Pinterest',
    engagementText: 'Save & Share',
    engagementType: [
      {
        title: 'Saves',
        amount: 30,
      },
      {
        title: 'Shares',
        amount: 18,
      },
    ],
    data: [{
      username: "Skylar_20",
      status: "completed",
      type: "like and comment."
    }]
  },
  {
    id: 106,
    name: 'Jane Smith',
    username: '@userMD',
    title: 'Trying out new recipes',
    socialText: 'Recipes on Pinterest',
    engagementText: 'Save & Share',
    engagementType: [
      {
        title: 'Saves',
        amount: 30,
      },
      {
        title: 'Shares',
        amount: 18,
      },
    ],
    data: [{
      username: "Skylar_20",
      status: "completed",
      type: "like and comment."
    }]
  },
  {
    id: 107,
    name: 'Jane Smith',
    username: '@Utty007',
    title: 'Weekend getaway vlog',
    socialText: 'Watch on Youtube',
    engagementText: 'Subscribe & Like',
    engagementType: [
      {
        title: 'Subscribers',
        amount: 90,
      },
      {
        title: 'Likes',
        amount: 40,
      },
    ],
    data: [{
      username: "Skylar_20",
      status: "completed",
      type: "like and comment."
    }]
  },
]
}));
