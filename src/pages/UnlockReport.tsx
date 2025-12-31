import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { CreditCard, ArrowLeft, Lock, Unlock, Shield, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { mockCreditReports, bureauConfig } from '@/data/mockData';

export default function UnlockReport() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get('reportId');
  const [report, setReport] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const foundReport = mockCreditReports.find(r => r.id === reportId);
    if (foundReport) {
      setReport(foundReport);
    }
  }, [reportId]);

  const lockedBureaus = report ? 
    ['cibil', 'experian', 'equifax', 'crif'].filter(b => !report.bureaus_checked.includes(b)) : [];

  const handleUnlock = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('Report unlocked successfully!');
    navigate(createPageUrl('CreditReport') + `?reportId=${reportId}`);
  };

  if (!report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Report Not Found</h2>
          <Button onClick={() => navigate(createPageUrl('Dashboard'))}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 py-4 md:px-8 border-b border-border bg-card">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-foreground">Unlock Report</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-accent" />
            Secure Payment
          </div>
        </nav>
      </header>

      <main className="px-4 py-8 md:py-12 md:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-500" />
                  Locked Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Report ID</span>
                    <span className="font-medium text-foreground">{report.id}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium text-foreground">{report.full_name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">PAN</span>
                    <span className="font-medium text-foreground">{report.pan_number}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Current Score</span>
                    <span className="font-bold text-2xl text-foreground">{report.average_score}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Bureaus Available to Unlock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {lockedBureaus.length > 0 ? lockedBureaus.map((bureau) => {
                    const config = bureauConfig[bureau as keyof typeof bureauConfig];
                    return (
                      <div key={bureau} className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                        <span className="text-2xl">{config.logo}</span>
                        <div>
                          <p className="font-medium text-foreground">{config.name}</p>
                          <p className="text-sm text-muted-foreground">₹99</p>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="col-span-2 text-center py-8">
                      <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-2" />
                      <p className="text-muted-foreground">All bureaus are already unlocked!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {lockedBureaus.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-medium text-foreground">Total Amount</span>
                    <span className="text-2xl font-bold text-foreground">₹{lockedBureaus.length * 99}</span>
                  </div>
                  <Button 
                    onClick={handleUnlock} 
                    className="w-full gap-2" 
                    size="lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Unlock className="w-5 h-5" />
                        Unlock All Bureaus
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
