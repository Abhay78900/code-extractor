import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { CreditReport } from '@/types';

interface AIReportAnalysisProps {
  report: CreditReport;
}

export default function AIReportAnalysis({ report }: AIReportAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const generateAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const score = report.average_score;
    const utilization = report.credit_utilization;
    
    let analysisText = '';
    
    if (score >= 750) {
      analysisText = `Excellent credit health! Your score of ${score} places you in the top tier of borrowers. Your payment history is strong, and lenders will likely offer you the best interest rates. Key strengths: ${report.active_accounts} active accounts with consistent payments. Recommendation: Maintain your current habits and consider leveraging your good credit for better financial products.`;
    } else if (score >= 650) {
      analysisText = `Good credit standing with room for improvement. Your score of ${score} is solid, but there are opportunities to reach excellent status. ${utilization > 30 ? `Your credit utilization of ${utilization}% is on the higher side - try to keep it below 30%.` : 'Your credit utilization is well managed.'} Focus on timely payments and avoiding new hard enquiries to boost your score.`;
    } else if (score >= 550) {
      analysisText = `Your credit score of ${score} indicates some challenges in your credit history. ${report.hard_enquiries > 3 ? `Multiple recent enquiries (${report.hard_enquiries}) may be impacting your score.` : ''} Priority actions: Focus on clearing any outstanding dues, reduce credit card balances, and avoid new credit applications for 6 months.`;
    } else {
      analysisText = `Your credit score of ${score} needs attention. This may be affecting your ability to get loans or credit cards at favorable rates. ${report.is_high_risk ? 'Risk flags have been detected in your profile.' : ''} Immediate steps: Review your report for errors, prioritize paying off overdue accounts, and consider a secured credit card to rebuild credit.`;
    }
    
    setAnalysis(analysisText);
    setIsAnalyzing(false);
  };

  const insights = [
    {
      label: 'Payment History',
      status: report.score_factors?.payment_history > 80 ? 'good' : 'warning',
      value: `${report.score_factors?.payment_history || 85}%`
    },
    {
      label: 'Credit Utilization',
      status: report.credit_utilization <= 30 ? 'good' : 'warning',
      value: `${report.credit_utilization}%`
    },
    {
      label: 'Credit Age',
      status: report.credit_age_years >= 3 ? 'good' : 'warning',
      value: `${report.credit_age_years} years`
    },
    {
      label: 'Credit Mix',
      status: report.active_loans.length > 0 && report.credit_cards.length > 0 ? 'good' : 'warning',
      value: `${report.active_loans.length + report.credit_cards.length} accounts`
    }
  ];

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Credit Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 bg-card rounded-lg border border-border"
            >
              <div className="flex items-center gap-2 mb-1">
                {insight.status === 'good' ? (
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                )}
                <span className="text-xs text-muted-foreground">{insight.label}</span>
              </div>
              <p className="text-lg font-bold text-foreground">{insight.value}</p>
            </motion.div>
          ))}
        </div>

        {!analysis ? (
          <Button 
            onClick={generateAnalysis} 
            disabled={isAnalyzing}
            className="w-full gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing your credit profile...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate AI Analysis
              </>
            )}
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-card rounded-xl border border-border"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">AI Analysis Summary</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{analysis}</p>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
