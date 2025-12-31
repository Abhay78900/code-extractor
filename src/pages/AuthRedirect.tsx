import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Loader2 } from 'lucide-react';
import { getCurrentUser } from '@/data/mockData';

export default function AuthRedirect() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || 'Dashboard';

  useEffect(() => {
    const handleRedirect = async () => {
      // Simulate auth check delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = getCurrentUser();
      
      if (!user) {
        navigate(createPageUrl('Login'));
        return;
      }

      // Redirect based on user role
      switch (user.user_role) {
        case 'MASTER_ADMIN':
          navigate(createPageUrl('MasterAdminDashboard'));
          break;
        case 'PARTNER_ADMIN':
          navigate(createPageUrl('PartnerDashboard'));
          break;
        default:
          navigate(createPageUrl(redirectTo));
      }
    };

    handleRedirect();
  }, [navigate, redirectTo]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Authenticating...</h2>
        <p className="text-muted-foreground">Please wait while we verify your session</p>
      </div>
    </div>
  );
}
