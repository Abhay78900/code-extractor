import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ClientData {
  full_name: string;
  pan_number: string;
  mobile: string;
  date_of_birth?: string;
  email?: string;
}

interface BureauReportRequest {
  client_data: ClientData;
  bureaus: string[];
  initiated_by: 'user' | 'partner';
}

// Mock bureau API responses - Replace with actual API calls when integrated
function generateMockBureauScore(bureau: string): number {
  // Generate realistic credit scores between 300-900
  const baseScore = Math.floor(Math.random() * 300) + 600;
  return Math.min(900, Math.max(300, baseScore));
}

function generateMockPaymentHistory(): Array<{ month: string; year: number; status: string; dpd: number }> {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const history = [];
  const currentYear = new Date().getFullYear();
  
  for (let y = currentYear - 2; y <= currentYear; y++) {
    for (let m = 0; m < 12; m++) {
      if (y === currentYear && m > new Date().getMonth()) break;
      
      const random = Math.random();
      let status = 'STD';
      let dpd = 0;
      
      if (random > 0.95) {
        status = 'SUB';
        dpd = Math.floor(Math.random() * 60) + 30;
      } else if (random > 0.9) {
        status = 'SMA';
        dpd = Math.floor(Math.random() * 30) + 1;
      }
      
      history.push({
        month: months[m],
        year: y,
        status,
        dpd,
      });
    }
  }
  
  return history;
}

function generateMockLoans(): Array<Record<string, unknown>> {
  const loanTypes = ['Home Loan', 'Personal Loan', 'Car Loan', 'Gold Loan', 'Education Loan'];
  const lenders = ['HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank', 'Kotak Bank'];
  const loans = [];
  const numLoans = Math.floor(Math.random() * 4) + 1;
  
  for (let i = 0; i < numLoans; i++) {
    const sanctionedAmount = Math.floor(Math.random() * 5000000) + 100000;
    const currentBalance = Math.floor(sanctionedAmount * (Math.random() * 0.8 + 0.1));
    const isClosed = Math.random() > 0.6;
    
    loans.push({
      loan_type: loanTypes[Math.floor(Math.random() * loanTypes.length)],
      lender: lenders[Math.floor(Math.random() * lenders.length)],
      account_number: `LOAN${Date.now()}${i}`,
      sanctioned_amount: sanctionedAmount,
      current_balance: isClosed ? 0 : currentBalance,
      emi_amount: Math.floor(sanctionedAmount / 120),
      tenure_months: Math.floor(Math.random() * 120) + 12,
      start_date: new Date(Date.now() - Math.random() * 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      closed_date: isClosed ? new Date().toISOString().split('T')[0] : null,
      status: isClosed ? 'Closed' : 'Active',
      overdue_amount: Math.random() > 0.9 ? Math.floor(Math.random() * 50000) : 0,
      rate_of_interest: `${(Math.random() * 8 + 6).toFixed(2)}%`,
      payment_history: generateMockPaymentHistory(),
      collateral_value: loanTypes[0] === 'Home Loan' ? sanctionedAmount * 1.2 : null,
      collateral_type: loanTypes[0] === 'Home Loan' ? 'Property' : null,
    });
  }
  
  return loans;
}

function generateMockCreditCards(): Array<Record<string, unknown>> {
  const banks = ['HDFC Bank', 'ICICI Bank', 'Axis Bank', 'SBI Cards', 'Kotak Bank'];
  const cardTypes = ['Platinum', 'Gold', 'Titanium', 'Classic', 'Signature'];
  const cards = [];
  const numCards = Math.floor(Math.random() * 3) + 1;
  
  for (let i = 0; i < numCards; i++) {
    const creditLimit = Math.floor(Math.random() * 500000) + 50000;
    const currentBalance = Math.floor(creditLimit * Math.random() * 0.6);
    
    cards.push({
      bank: banks[Math.floor(Math.random() * banks.length)],
      card_type: cardTypes[Math.floor(Math.random() * cardTypes.length)],
      credit_limit: creditLimit,
      current_balance: currentBalance,
      available_credit: creditLimit - currentBalance,
      utilization: Math.round((currentBalance / creditLimit) * 100),
      status: 'Active',
      payment_history: generateMockPaymentHistory(),
    });
  }
  
  return cards;
}

function generateMockEnquiries(): Array<Record<string, unknown>> {
  const institutions = ['HDFC Bank', 'ICICI Bank', 'Bajaj Finance', 'Tata Capital', 'Axis Bank'];
  const purposes = ['Home Loan', 'Personal Loan', 'Credit Card', 'Car Loan', 'Business Loan'];
  const enquiries = [];
  const numEnquiries = Math.floor(Math.random() * 5) + 1;
  
  for (let i = 0; i < numEnquiries; i++) {
    enquiries.push({
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      institution: institutions[Math.floor(Math.random() * institutions.length)],
      purpose: purposes[Math.floor(Math.random() * purposes.length)],
      amount: Math.floor(Math.random() * 1000000) + 50000,
    });
  }
  
  return enquiries;
}

function calculateScoreCategory(score: number): string {
  if (score >= 800) return 'Excellent';
  if (score >= 700) return 'Good';
  if (score >= 600) return 'Fair';
  if (score >= 500) return 'Poor';
  return 'Very Poor';
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: BureauReportRequest = await req.json();
    const { client_data, bureaus, initiated_by } = body;

    // Validate input
    if (!client_data.pan_number || !client_data.full_name || !client_data.mobile) {
      return new Response(
        JSON.stringify({ error: 'Missing required client data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!bureaus || bureaus.length === 0) {
      return new Response(
        JSON.stringify({ error: 'At least one bureau must be selected' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate mock data for selected bureaus only
    const reportData: Record<string, unknown> = {};
    let totalScore = 0;
    let scoreCount = 0;

    // Only generate scores for selected bureaus
    if (bureaus.includes('cibil')) {
      reportData.cibil_score = generateMockBureauScore('cibil');
      totalScore += reportData.cibil_score as number;
      scoreCount++;
    }
    if (bureaus.includes('experian')) {
      reportData.experian_score = generateMockBureauScore('experian');
      totalScore += reportData.experian_score as number;
      scoreCount++;
    }
    if (bureaus.includes('equifax')) {
      reportData.equifax_score = generateMockBureauScore('equifax');
      totalScore += reportData.equifax_score as number;
      scoreCount++;
    }
    if (bureaus.includes('crif')) {
      reportData.crif_score = generateMockBureauScore('crif');
      totalScore += reportData.crif_score as number;
      scoreCount++;
    }

    const averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
    const loans = generateMockLoans();
    const creditCards = generateMockCreditCards();
    const activeLoans = loans.filter(l => l.status === 'Active');
    const closedLoans = loans.filter(l => l.status === 'Closed');

    // Calculate credit utilization from credit cards
    const totalLimit = creditCards.reduce((sum, card) => sum + (card.credit_limit as number), 0);
    const totalBalance = creditCards.reduce((sum, card) => sum + (card.current_balance as number), 0);
    const creditUtilization = totalLimit > 0 ? Math.round((totalBalance / totalLimit) * 100) : 0;

    // Generate improvement tips based on score
    const improvementTips: string[] = [];
    if (averageScore < 700) {
      improvementTips.push('Pay all EMIs and credit card bills on time');
      improvementTips.push('Reduce credit card utilization below 30%');
    }
    if (creditUtilization > 30) {
      improvementTips.push('Consider paying down credit card balances');
    }
    if (loans.some(l => (l.overdue_amount as number) > 0)) {
      improvementTips.push('Clear overdue amounts immediately');
    }

    // Determine risk level
    const isHighRisk = averageScore < 500 || loans.some(l => (l.overdue_amount as number) > 50000);
    const riskFlags: string[] = [];
    if (averageScore < 500) riskFlags.push('Low credit score');
    if (creditUtilization > 80) riskFlags.push('High credit utilization');
    if (loans.some(l => (l.overdue_amount as number) > 0)) riskFlags.push('Outstanding overdue amounts');

    const response = {
      ...reportData,
      average_score: averageScore,
      score_category: calculateScoreCategory(averageScore),
      credit_utilization: creditUtilization,
      total_accounts: loans.length + creditCards.length,
      active_accounts: activeLoans.length + creditCards.length,
      closed_accounts: closedLoans.length,
      hard_enquiries: Math.floor(Math.random() * 5) + 1,
      soft_enquiries: Math.floor(Math.random() * 3),
      oldest_account_age_months: Math.floor(Math.random() * 120) + 12,
      credit_age_years: Math.floor(Math.random() * 10) + 1,
      active_loans: activeLoans,
      closed_loans: closedLoans,
      credit_cards: creditCards,
      enquiry_details: generateMockEnquiries(),
      score_factors: {
        payment_history: 85 + Math.floor(Math.random() * 15),
        credit_utilization: 100 - creditUtilization,
        credit_age: 60 + Math.floor(Math.random() * 40),
        credit_mix: 70 + Math.floor(Math.random() * 30),
        new_credit: 80 + Math.floor(Math.random() * 20),
      },
      improvement_tips: improvementTips,
      is_high_risk: isHighRisk,
      risk_flags: riskFlags,
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in fetch-bureau-report:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
