
import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  username: string;
  iconUrl?: string;
}

interface AuthState {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateIcon: (iconUrl: string) => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,

  login: async (username: string, password: string) => {
    try {
      // Convert username to lowercase for consistent email formation
      const normalizedUsername = username.toLowerCase();
      const email = `${normalizedUsername}@ascii-bbs.local`;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Enhance error message for invalid credentials
        if (error.message === "Invalid login credentials") {
          throw new Error("Invalid username or password. Please try again.");
        }
        throw error;
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, icon_url')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          set({
            user: {
              id: data.user.id,
              username: profile.username,
              iconUrl: profile.icon_url || undefined,
            },
          });
        }
      }
    } catch (error) {
      throw error;
    }
  },

  register: async (username: string, password: string) => {
    try {
      // Convert username to lowercase for checking
      const normalizedUsername = username.toLowerCase();
      
      // Check if username already exists (case insensitive)
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('username')
        .ilike('username', normalizedUsername)
        .single();

      if (existingProfile) {
        throw new Error('Username already taken');
      }

      // Use normalized username for email
      const email = `${normalizedUsername}@ascii-bbs.local`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username, // Keep original case for display
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        set({
          user: {
            id: data.user.id,
            username: username,
          },
        });
      }
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null });
  },

  updateIcon: async (iconUrl: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({ icon_url: iconUrl })
        .eq('id', user.id);

      if (error) throw error;

      set((state) => ({
        user: state.user ? { ...state.user, iconUrl } : null,
      }));
    } catch (error) {
      throw error;
    }
  },
}));

// Initialize auth state from session
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session?.user) {
    supabase
      .from('profiles')
      .select('username, icon_url')
      .eq('id', session.user.id)
      .single()
      .then(({ data: profile }) => {
        if (profile) {
          useAuth.setState({
            user: {
              id: session.user.id,
              username: profile.username,
              iconUrl: profile.icon_url || undefined,
            },
          });
        }
      });
  }
});

// Listen for auth changes
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, icon_url')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      useAuth.setState({
        user: {
          id: session.user.id,
          username: profile.username,
          iconUrl: profile.icon_url || undefined,
        },
      });
    }
  } else if (event === 'SIGNED_OUT') {
    useAuth.setState({ user: null });
  }
});
