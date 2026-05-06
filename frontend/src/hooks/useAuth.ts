import { useAuthContext } from '@/contexts/AuthContext';

export interface AuthState {
  user: any | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthState {
  const context = useAuthContext();
  return { 
    user: context.user, 
    loading: context.loading, 
    login: context.login,
    signOut: context.logout 
  };
}



