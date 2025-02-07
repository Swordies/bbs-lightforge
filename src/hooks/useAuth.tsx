
import { create } from "zustand";
import Cookies from "js-cookie";

interface User {
  id: string;
  username: string;
  iconUrl?: string;
}

interface AuthState {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateIcon: (iconUrl: string) => Promise<void>;
}

const COOKIE_KEY = 'user';
const COOKIE_EXPIRES = 30; // days

// Memoized initial user state from cookies
const getInitialUser = (): User | null => {
  try {
    const userCookie = Cookies.get(COOKIE_KEY);
    return userCookie ? JSON.parse(userCookie) : null;
  } catch {
    // If cookie parsing fails, remove corrupted cookie and return null
    Cookies.remove(COOKIE_KEY);
    return null;
  }
};

export const useAuth = create<AuthState>((set) => ({
  user: getInitialUser(),
  
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
  }
}));
