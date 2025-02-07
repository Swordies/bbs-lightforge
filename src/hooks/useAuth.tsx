
import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

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
    // For username-based login, we'll use the username as the email
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${username}@example.com`,
      password,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    if (!data.user) {
      throw new Error("No user returned from login");
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profile) {
      set({
        user: {
          id: data.user.id,
          username: profile.username,
          iconUrl: profile.icon_url,
        },
      });
    }
  },
  
  register: async (username: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: `${username}@example.com`,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    if (data.user) {
      set({
        user: {
          id: data.user.id,
          username,
        },
      });
    }
  },
  
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    set({ user: null });
  },
  
  updateIcon: async (iconUrl: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Not authenticated");
    }

    const { error } = await supabase
      .from('profiles')
      .update({ icon_url: iconUrl })
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    set((state) => ({
      user: state.user ? { ...state.user, iconUrl } : null,
    }));
  },
}));

// Initialize auth state from session
supabase.auth.getSession().then(async ({ data: { session } }) => {
  if (session?.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      useAuth.setState({
        user: {
          id: session.user.id,
          username: profile.username,
          iconUrl: profile.icon_url,
        },
      });
    }
  }
});

// Listen for auth changes
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      useAuth.setState({
        user: {
          id: session.user.id,
          username: profile.username,
          iconUrl: profile.icon_url,
        },
      });
    }
  } else if (event === 'SIGNED_OUT') {
    useAuth.setState({ user: null });
  }
});
