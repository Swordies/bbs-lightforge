
import { create } from "zustand";
import Cookies from "js-cookie";

interface User {
  id: string;
  username: string;
  iconUrl?: string;
  usernameBoxColor?: string;
}

interface Post {
  id: string;
  content: string;
  author: string;
  authorIcon?: string;
  createdAt: Date;
  editedAt?: Date;
  replies?: Array<{
    id: string;
    content: string;
    author: string;
    authorIcon?: string;
    createdAt: Date;
    editedAt?: Date;
  }>;
}

interface AuthState {
  user: User | null;
  posts: Record<string, Post[]>;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateIcon: (iconUrl: string) => Promise<void>;
  updateUsernameBoxColor: (color: string) => Promise<void>;
  savePosts: (channelId: string, posts: Post[]) => void;
  getChannelPosts: (channelId: string) => Post[];
}

const COOKIE_KEY = 'user';
const POSTS_COOKIE_KEY = 'channel_posts';
const COOKIE_EXPIRES = 30;

const getInitialUser = (): User | null => {
  try {
    const userCookie = Cookies.get(COOKIE_KEY);
    return userCookie ? JSON.parse(userCookie) : null;
  } catch {
    Cookies.remove(COOKIE_KEY);
    return null;
  }
};

const getInitialPosts = (): Record<string, Post[]> => {
  try {
    const postsCookie = Cookies.get(POSTS_COOKIE_KEY);
    if (!postsCookie) return {};
    
    const posts = JSON.parse(postsCookie);
    Object.values(posts).forEach((channelPosts: Post[]) => {
      channelPosts.forEach(post => {
        post.createdAt = new Date(post.createdAt);
        if (post.editedAt) post.editedAt = new Date(post.editedAt);
        post.replies?.forEach(reply => {
          reply.createdAt = new Date(reply.createdAt);
          if (reply.editedAt) reply.editedAt = new Date(reply.editedAt);
        });
      });
    });
    return posts;
  } catch {
    Cookies.remove(POSTS_COOKIE_KEY);
    return {};
  }
};

export const useAuth = create<AuthState>((set, get) => ({
  user: getInitialUser(),
  posts: getInitialPosts(),
  
  login: async (username: string, password: string) => {
    const user: User = { id: "1", username };
    Cookies.set(COOKIE_KEY, JSON.stringify(user), { expires: COOKIE_EXPIRES });
    set({ user });
  },
  
  register: async (username: string, password: string) => {
    const user: User = { id: "1", username };
    Cookies.set(COOKIE_KEY, JSON.stringify(user), { expires: COOKIE_EXPIRES });
    set({ user });
  },
  
  logout: () => {
    Cookies.remove(COOKIE_KEY);
    set({ user: null });
  },
  
  updateIcon: async (iconUrl: string) => {
    set((state) => {
      if (!state.user) return state;
      
      const updatedUser = { ...state.user, iconUrl };
      Cookies.set(COOKIE_KEY, JSON.stringify(updatedUser), { expires: COOKIE_EXPIRES });
      return { user: updatedUser };
    });
  },

  updateUsernameBoxColor: async (color: string) => {
    set((state) => {
      if (!state.user) return state;
      
      const updatedUser = { ...state.user, usernameBoxColor: color };
      Cookies.set(COOKIE_KEY, JSON.stringify(updatedUser), { expires: COOKIE_EXPIRES });
      return { user: updatedUser };
    });
  },

  savePosts: (channelId: string, posts: Post[]) => {
    set((state) => {
      const newPosts = { ...state.posts, [channelId]: posts };
      Cookies.set(POSTS_COOKIE_KEY, JSON.stringify(newPosts), { expires: COOKIE_EXPIRES });
      return { posts: newPosts };
    });
  },

  getChannelPosts: (channelId: string) => {
    const state = get();
    return state.posts[channelId] || [];
  },
}));

