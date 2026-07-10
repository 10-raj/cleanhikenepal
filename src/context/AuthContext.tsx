import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (userId: string, userEmail: string): Promise<User> => {
    // Fetch the user's role from user_profiles table (source of truth for admin role)
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role, name')
      .eq('id', userId)
      .maybeSingle();

    return {
      id: userId,
      email: userEmail,
      name: profile?.name || userEmail.split('@')[0],
      role: (profile?.role as 'user' | 'admin') || 'user',
    };
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profileUser = await fetchUserProfile(session.user.id, session.user.email || '');
        setUser(profileUser);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profileUser = await fetchUserProfile(session.user.id, session.user.email || '');
        setUser(profileUser);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // Immediately fetch the profile to get the correct role
    if (data.user) {
      const profileUser = await fetchUserProfile(data.user.id, data.user.email || '');
      setUser(profileUser);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
