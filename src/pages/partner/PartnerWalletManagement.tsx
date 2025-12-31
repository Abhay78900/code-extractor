import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Wallet, Plus, ArrowUpRight, ArrowDownRight, Clock, CreditCard, IndianRupee } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import PartnerSidebar from '@/components/partner/PartnerSidebar';
import WalletCard from '@/components/partner/WalletCard';
import WalletTransactionHistory from '@/components/partner/WalletTransactionHistory';
import { mockPartners, mockWalletTransactions } from '@/data/mockData';

export default function PartnerWalletManagement() {
  const navigate = useNavigate();
  const [partner, setPartner] = useState(mockPartners[0]);
  const [transactions, setTransactions] = useState(mockWalletTransactions);
  const [loadAmount, setLoadAmount] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate(createPageUrl('Home'));
  };

  const handleLoadFunds = () => {
    const amount = parseFloat(loadAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const newTransaction = {
      id: `wt_${Date.now()}`,
      partner_id: partner.id,
      partner_email: partner.owner_email,
      transaction_type: 'credit' as const,
      amount: amount,
      balance_before: partner.wallet_balance,
      balance_after: partner.wallet_balance + amount,
      description: 'Wallet top-up via online payment',
      status: 'success' as const,
      created_date: new Date().toISOString(),
    };

    setTransactions([newTransaction, ...transactions]);
    setPartner({ ...partner, wallet_balance: partner.wallet_balance + amount });
    setLoadAmount('');
    setIsDialogOpen(false);
    toast.success(`₹${amount.toLocaleString()} added to wallet successfully!`);
  };

  const totalCredits = transactions
    .filter(t => t.transaction_type === 'credit' && t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebits = transactions
    .filter(t => t.transaction_type === 'debit' && t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-background flex w-full">
      <PartnerSidebar onLogout={handleLogout} />
      
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Wallet Management</h1>
              <p className="text-muted-foreground">Manage your wallet balance and transactions</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Funds
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Funds to Wallet</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Amount (₹)</Label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={loadAmount}
                      onChange={(e) => setLoadAmount(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[500, 1000, 2000, 5000].map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        onClick={() => setLoadAmount(amount.toString())}
                      >
                        ₹{amount}
                      </Button>
                    ))}
                  </div>
                  <Button onClick={handleLoadFunds} className="w-full">
                    Proceed to Payment
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <WalletCard
              partner={{ wallet_balance: partner.wallet_balance, total_wallet_loaded: partner.total_wallet_loaded }}
              onLoadFunds={async (amount) => {
                setPartner({ ...partner, wallet_balance: partner.wallet_balance + amount });
              }}
            />
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <ArrowUpRight className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Credits</p>
                    <p className="text-2xl font-bold text-foreground">₹{totalCredits.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center">
                    <ArrowDownRight className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Debits</p>
                    <p className="text-2xl font-bold text-foreground">₹{totalDebits.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WalletTransactionHistory transactions={transactions} />
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
