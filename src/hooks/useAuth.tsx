
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

// Load initial user state from cookies
const getInitialUser = (): User | null => {
  const userCookie = Cookies.get('user');
  return userCookie ? JSON.parse(userCookie) : null;
};

export const useAuth = create<AuthState>((set) => ({
  user: getInitialUser(),
  login: async (username: string, password: string) => {
    const user = { id: "1", username };
    // Store user data in cookie, expires in 30 days
    Cookies.set('user', JSON.stringify(user), { expires: 30 });
    set({ user });
  },
  register: async (username: string, password: string) => {
    const user = { id: "1", username };
    // Store user data in cookie, expires in 30 days
    Cookies.set('user', JSON.stringify(user), { expires: 30 });
    set({ user });
  },
  logout: () => {
    // Remove user cookie on logout
    Cookies.remove('user');
    set({ user: null });
  },
  updateIcon: async (iconUrl: string) => {
    set((state) => {
      const updatedUser = state.user ? { ...state.user, iconUrl } : null;
      // Update cookie with new icon URL
      if (updatedUser) {
        Cookies.set('user', JSON.stringify(updatedUser), { expires: 30 });
      }
      return { user: updatedUser };
    });
  }
}));
