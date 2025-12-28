import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { FileText, TrendingUp, IndianRupee, Copy, Check, Users, Plus } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PartnerSidebar from '@/components/partner/PartnerSidebar';
import StatsCard from '@/components/admin/StatsCard';
import WalletCard from '@/components/partner/WalletCard';
import GenerateReportDialog from '@/components/partner/GenerateReportDialog';
import PartnerReportHistory from '@/components/partner/PartnerReportHistory';
import WalletTransactionHistory from '@/components/partner/WalletTransactionHistory';
import { mockPartners, mockCreditReports, mockWalletTransactions, bureauConfig } from '@/data/mockData';
import { CreditReport, Partner, WalletTransaction } from '@/types';
import { toast } from 'sonner';

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [partner, setPartner] = useState<Partner>(() => ({ ...mockPartners[0] }));
  const [generatedReports, setGeneratedReports] = useState<CreditReport[]>([]);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(() =>
    mockWalletTransactions.filter(t => t.partner_id === mockPartners[0].id)
  );

  const handleLogout = () => {
    sessionStorage.clear();
    navigate(createPageUrl('Home'));
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(partner.franchise_id);
    setCopied(true);
    toast.success('Referral code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadFunds = useCallback(async (amount: number) => {
    const balanceBefore = partner.wallet_balance;
    const balanceAfter = balanceBefore + amount;

    setPartner(prev => ({ ...prev, wallet_balance: balanceAfter, total_wallet_loaded: prev.total_wallet_loaded + amount }));

    const newTransaction: WalletTransaction = {
      id: `wtxn_${Date.now()}`,
      partner_id: partner.id,
      partner_email: partner.owner_email,
      transaction_type: 'credit',
      amount,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      description: 'Wallet top-up',
      status: 'success',
      created_date: new Date().toISOString()
    };

    setWalletTransactions(prev => [newTransaction, ...prev]);
  }, [partner]);

  const handleGenerateReport = useCallback(async (clientData: any, bureaus: string[]) => {
    const totalAmount = bureaus.length * 99;
    if (partner.wallet_balance < totalAmount) throw new Error('Insufficient balance');

    await new Promise(resolve => setTimeout(resolve, 1500));

    const scores: Record<string, number> = {};
    bureaus.forEach(b => { scores[b] = 600 + Math.floor(Math.random() * 250); });
    const avgScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / bureaus.length);

    const newReport: CreditReport = {
      id: `report_${Date.now()}`,
      user_email: `${clientData.pan_number.toLowerCase()}@client.com`,
      full_name: clientData.full_name,
      pan_number: clientData.pan_number,
      mobile: clientData.mobile,
      date_of_birth: clientData.date_of_birth,
      report_status: 'UNLOCKED',
      initiated_by: 'partner',
      partner_id: partner.id,
      bureaus_checked: bureaus.map(b => bureauConfig[b]?.fullName || b),
      cibil_score: scores.cibil,
      experian_score: scores.experian,
      equifax_score: scores.equifax,
      crif_score: scores.crif,
      average_score: avgScore,
      score_category: avgScore >= 750 ? 'Excellent' : avgScore >= 650 ? 'Good' : 'Average',
      report_generated_at: new Date().toISOString(),
      created_date: new Date().toISOString(),
      credit_utilization: Math.floor(Math.random() * 50) + 10,
      total_accounts: 3, active_accounts: 2, closed_accounts: 1,
      hard_enquiries: 2, soft_enquiries: 1,
      active_loans: [], closed_loans: [], credit_cards: [], enquiry_details: [],
      oldest_account_age_months: 36, credit_age_years: 3,
      score_factors: { payment_history: 80, credit_utilization: 70, credit_age: 60, credit_mix: 75, new_credit: 65 },
      improvement_tips: ['Maintain low utilization'], is_high_risk: avgScore < 600,
    };

    setGeneratedReports(prev => [newReport, ...prev]);
    setPartner(prev => ({ ...prev, wallet_balance: prev.wallet_balance - totalAmount, total_sales: prev.total_sales + 1 }));
  }, [partner]);

  const allPartnerReports = [...generatedReports, ...mockCreditReports.filter(r => r.partner_id === partner.id)];

  return (
    <div className="min-h-screen bg-background flex">
      <PartnerSidebar currentPage="PartnerDashboard" onLogout={handleLogout} partner={partner} />

      <main className="flex-1 px-6 py-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-display font-bold text-foreground">Partner Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {partner.name}</p>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-primary-foreground border-0">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-purple-200 text-sm mb-1">Your Franchise ID</p>
                    <div className="flex items-center gap-3">
                      <code className="text-3xl font-bold tracking-wider">{partner.franchise_id}</code>
                      <Button variant="ghost" size="icon" onClick={copyReferralCode} className="text-primary-foreground hover:bg-primary-foreground/20">
                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </Button>
                    </div>
                  </div>
                  <Button onClick={() => setShowGenerateDialog(true)} className="bg-primary-foreground text-purple-700 hover:bg-purple-50 gap-2">
                    <FileText className="w-4 h-4" /> Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <WalletCard partner={partner} onLoadFunds={handleLoadFunds} />
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              <StatsCard title="Total Sales" value={partner.total_sales} icon={FileText} color="blue" delay={0.1} />
              <StatsCard title="Revenue" value={`₹${partner.total_revenue.toLocaleString()}`} icon={TrendingUp} color="purple" delay={0.2} />
              <StatsCard title="Commission" value={`₹${partner.total_commission_earned.toLocaleString()}`} icon={IndianRupee} color="amber" delay={0.3} />
              <StatsCard title="Clients" value={allPartnerReports.length} icon={Users} color="teal" delay={0.4} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PartnerReportHistory reports={allPartnerReports} onViewReport={(r) => navigate(createPageUrl('CreditReport'))} />
            <WalletTransactionHistory transactions={walletTransactions} />
          </div>
        </div>
      </main>

      <GenerateReportDialog isOpen={showGenerateDialog} onClose={() => setShowGenerateDialog(false)} onGenerate={handleGenerateReport} walletBalance={partner.wallet_balance} />
    </div>
  );
}
