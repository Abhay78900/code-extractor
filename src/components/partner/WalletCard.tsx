import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Wallet, Plus, Loader2, CheckCircle2, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface Partner {
  wallet_balance?: number;
  total_wallet_loaded?: number;
}

interface WalletCardProps {
  partner?: Partner;
  onLoadFunds?: (amount: number) => Promise<void>;
  isLoading?: boolean;
}

export default function WalletCard({ partner, onLoadFunds }: WalletCardProps) {
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [amount, setAmount] = useState('');
  const [loadingFunds, setLoadingFunds] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const walletBalance = partner?.wallet_balance || 0;
  const totalLoaded = partner?.total_wallet_loaded || 0;

  const handleLoadFunds = async () => {
    const numAmount = parseInt(amount);
    if (!numAmount || numAmount < 100) {
      toast.error('Minimum amount is ₹100');
      return;
    }

    setLoadingFunds(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await onLoadFunds?.(numAmount);
      setPaymentSuccess(true);
      setTimeout(() => {
        setShowLoadDialog(false);
        setPaymentSuccess(false);
        setAmount('');
      }, 2000);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoadingFunds(false);
    }
  };

  const quickAmounts = [500, 1000, 2000, 5000];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-primary-foreground border-0 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <Button
                onClick={() => setShowLoadDialog(true)}
                size="sm"
                className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0 gap-1"
              >
                <Plus className="w-4 h-4" /> Add Funds
              </Button>
            </div>

            <div>
              <p className="text-primary-foreground/70 text-sm">Available Balance</p>
              <p className="text-4xl font-bold mt-1">₹{walletBalance.toLocaleString()}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-primary-foreground/20 flex justify-between text-sm">
              <div>
                <p className="text-primary-foreground/70">Total Loaded</p>
                <p className="font-semibold">₹{totalLoaded.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-primary-foreground/70">Total Spent</p>
                <p className="font-semibold">₹{(totalLoaded - walletBalance).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Load Funds Dialog */}
      <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
        <DialogContent className="sm:max-w-md">
          {paymentSuccess ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Payment Successful!</h3>
              <p className="text-muted-foreground">₹{amount} has been added to your wallet</p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Add Funds to Wallet</DialogTitle>
                <DialogDescription>
                  Load money into your wallet to generate credit reports
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Enter Amount</label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-8 text-lg"
                      min={100}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Minimum: ₹100</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Quick Select</p>
                  <div className="grid grid-cols-4 gap-2">
                    {quickAmounts.map((amt) => (
                      <Button
                        key={amt}
                        variant={amount === String(amt) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setAmount(String(amt))}
                      >
                        ₹{amt}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleLoadFunds}
                  disabled={loadingFunds || !amount}
                  className="w-full"
                  size="lg"
                >
                  {loadingFunds ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ₹${amount || '0'}`
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  Secured with 256-bit encryption
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
