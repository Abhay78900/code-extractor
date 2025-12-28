import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, ArrowLeft, TrendingUp, CreditCard as CardIcon, FileText, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCreditReports } from '@/data/mockData';
import { formatCurrency } from '@/utils';

export default function Dashboard() {
  const navigate = useNavigate();
  const report = mockCreditReports[0];

  const bureauScores = [
    { name: 'CIBIL', score: report.cibil_score, bg: 'bg-blue-50', text: 'text-blue-600', logo: '🔵' },
    { name: 'Experian', score: report.experian_score, bg: 'bg-purple-50', text: 'text-purple-600', logo: '🟣' },
    { name: 'Equifax', score: report.equifax_score, bg: 'bg-red-50', text: 'text-red-600', logo: '🔴' },
    { name: 'CRIF', score: report.crif_score, bg: 'bg-green-50', text: 'text-green-600', logo: '🟢' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 py-4 md:px-8 border-b border-border bg-card sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-foreground">Dashboard</span>
            </div>
          </div>
        </nav>
      </header>

      <main className="px-4 py-8 md:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Average Score Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-gradient-navy text-primary-foreground overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <p className="text-primary-foreground/70 mb-2">Your Average Credit Score</p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-6xl font-display font-bold">{report.average_score}</span>
                      <span className="text-primary-foreground/60 text-xl">/ 900</span>
                    </div>
                    <span className="inline-block mt-3 px-4 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full font-medium">
                      {report.score_category}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {bureauScores.map((bureau) => (
                      <div key={bureau.name} className="bg-primary-foreground/10 rounded-xl p-4 text-center min-w-[100px]">
                        <span className="text-2xl">{bureau.logo}</span>
                        <p className="text-sm text-primary-foreground/70 mt-1">{bureau.name}</p>
                        <p className="text-2xl font-bold">{bureau.score}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: TrendingUp, label: 'Credit Utilization', value: `${report.credit_utilization}%`, color: 'text-primary' },
              { icon: CardIcon, label: 'Active Accounts', value: report.active_accounts, color: 'text-accent' },
              { icon: FileText, label: 'Hard Enquiries', value: report.hard_enquiries, color: 'text-amber-500' },
              { icon: AlertCircle, label: 'Credit Age', value: `${report.credit_age_years} Years`, color: 'text-blue-500' }
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card>
                  <CardContent className="p-6">
                    <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
                    <p className="text-muted-foreground text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Active Loans */}
          <Card>
            <CardHeader>
              <CardTitle>Active Loans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {report.active_loans.slice(0, 3).map((loan, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div>
                      <p className="font-medium text-foreground">{loan.loan_type}</p>
                      <p className="text-sm text-muted-foreground">{loan.lender}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{formatCurrency(loan.current_balance)}</p>
                      <p className="text-sm text-muted-foreground">EMI: {formatCurrency(loan.emi_amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
