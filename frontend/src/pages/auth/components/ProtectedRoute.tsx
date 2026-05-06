import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { StudioLoading } from '@/pages/studio/components/studio/StudioLoading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      // Store the attempted URL to redirect back after login
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [user, loading, navigate, location]);

  if (loading) {
    return <StudioLoading message="Verifying your account..." submessage="Checking your access permissions..." />;
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
};



