
import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateIcon: (iconUrl: string) => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    set({ user: data.user });
  },
  
  register: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    set({ user: data.user });
  },
  
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null });
  },
  
  updateIcon: async (iconUrl: string) => {
    const { data: { user }, error } = await supabase.auth.updateUser({
      data: { avatar_url: iconUrl }
    });
    if (error) throw error;
    if (user) set({ user });
  }
}));

// Initialize auth state
supabase.auth.onAuthStateChange((event, session) => {
  useAuth.setState({ user: session?.user || null });
});
