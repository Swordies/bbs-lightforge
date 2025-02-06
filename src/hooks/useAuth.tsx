
import { create } from "zustand";

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

export const useAuth = create<AuthState>((set) => ({
  user: null,
  login: async (username: string, password: string) => {
    // For demo purposes, we'll just set the user
    set({ user: { id: "1", username } });
  },
  register: async (username: string, password: string) => {
    // For demo purposes, we'll just set the user
    set({ user: { id: "1", username } });
  },
  logout: () => set({ user: null }),
  updateIcon: async (iconUrl: string) => {
    set((state) => ({
      user: state.user ? { ...state.user, iconUrl } : null
    }));
  }
}));
