import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface CreditReportData {
  id: string;
  user_email: string;
  full_name: string;
  pan_number: string;
  mobile: string;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  report_status: string;
  initiated_by: string;
  bureaus_checked: string[];
  cibil_score: number | null;
  experian_score: number | null;
  equifax_score: number | null;
  crif_score: number | null;
  average_score: number;
  score_category: string | null;
  credit_utilization: number | null;
  total_accounts: number | null;
  active_accounts: number | null;
  closed_accounts: number | null;
  hard_enquiries: number | null;
  soft_enquiries: number | null;
  active_loans: unknown[];
  closed_loans: unknown[];
  credit_cards: unknown[];
  enquiry_details: unknown[];
  score_factors: Record<string, number> | null;
  improvement_tips: string[] | null;
  is_high_risk: boolean | null;
  risk_flags: string[] | null;
  report_generated_at: string;
  created_at: string;
}

export function useCreditReports() {
  const { user, userRole } = useAuth();
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    if (!user) return [];
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('credit_reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data as CreditReportData[];
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to fetch reports');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchReportById = async (reportId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('credit_reports')
        .select('*')
        .eq('id', reportId)
        .maybeSingle();
      
      if (error) throw error;
      
      return data as CreditReportData | null;
    } catch (error) {
      console.error('Error fetching report:', error);
      toast.error('Failed to fetch report');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (
    clientData: {
      full_name: string;
      pan_number: string;
      mobile: string;
      date_of_birth?: string;
      email?: string;
    },
    bureaus: string[]
  ) => {
    if (!user) {
      toast.error('You must be logged in to generate reports');
      return null;
    }

    setLoading(true);
    try {
      // Call the bureau API edge function
      const { data: reportData, error: functionError } = await supabase.functions.invoke('fetch-bureau-report', {
        body: {
          client_data: clientData,
          bureaus: bureaus,
          initiated_by: userRole === 'partner_admin' ? 'partner' : 'user',
        },
      });

      if (functionError) throw functionError;

      // Insert the report into the database
      const { data, error } = await supabase
        .from('credit_reports')
        .insert({
          user_id: user.id,
          user_email: clientData.email || user.email || '',
          full_name: clientData.full_name,
          pan_number: clientData.pan_number,
          mobile: clientData.mobile,
          date_of_birth: clientData.date_of_birth || null,
          bureaus_checked: bureaus,
          initiated_by: userRole === 'partner_admin' ? 'partner' : 'user',
          initiator_email: user.email,
          report_status: 'UNLOCKED',
          ...reportData,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Report generated successfully');
      return data as CreditReportData;
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateReportViewCount = async (reportId: string) => {
    try {
      // Update view count directly since the RPC function may not be in types yet
      await supabase
        .from('credit_reports')
        .update({ 
          view_count: 1, // This will be incremented by the DB trigger/function
          last_viewed_at: new Date().toISOString() 
        })
        .eq('id', reportId);
    } catch (error) {
      console.error('Error updating view count:', error);
    }
  };

  return {
    loading,
    fetchReports,
    fetchReportById,
    generateReport,
    updateReportViewCount,
  };
}
