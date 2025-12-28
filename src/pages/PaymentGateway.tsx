import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CreditCard,
  ArrowLeft,
  Shield,
  Check,
  IndianRupee,
  Smartphone,
  Building2,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { mockCreditReports } from '@/data/mockData';

const paymentMethods = [
  { id: 'upi', name: 'UPI', icon: Smartphone, description: 'Google Pay, PhonePe, Paytm' },
  { id: 'card', name: 'Card', icon: CreditCard, description: 'Debit/Credit Card' },
  { id: 'netbanking', name: 'Net Banking', icon: Building2, description: 'All major banks' },
];

export default function PaymentGateway() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedBureaus, setSelectedBureaus] = useState<string[]>([]);

  useEffect(() => {
    const amount = sessionStorage.getItem('totalAmount');
    const bureaus = sessionStorage.getItem('selectedBureaus');
    
    if (!amount || !bureaus) {
      toast.error('Please select bureaus first');
      navigate('/select-reports');
      return;
    }
    
    setTotalAmount(parseInt(amount));
    setSelectedBureaus(JSON.parse(bureaus));
  }, [navigate]);

  const handlePayment = async () => {
    if (paymentMethod === 'upi' && !upiId) {
      toast.error('Please enter UPI ID');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setPaymentSuccess(true);
    
    // Clear session storage
    sessionStorage.removeItem('creditCheckFormData');
    sessionStorage.removeItem('selectedBureaus');
    sessionStorage.removeItem('totalAmount');
    sessionStorage.removeItem('pendingRegistration');

    toast.success('Payment successful! Generating your credit report...');
    
    // Redirect to credit report after showing success
    setTimeout(() => {
      navigate(`/credit-report?reportId=${mockCreditReports[0].id}`);
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </motion.div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground mb-4">₹{totalAmount} paid successfully</p>
          <p className="text-sm text-muted-foreground">Generating your credit report...</p>
          <Loader2 className="w-6 h-6 animate-spin mx-auto mt-4 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 py-4 md:px-8 border-b border-border bg-card">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/select-reports')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-foreground">CreditCheck</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-accent" />
            256-bit Encrypted
          </div>
        </nav>
      </header>

      {/* Progress Steps */}
      <div className="px-4 py-6 md:px-8 border-b border-border bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-foreground">Details</span>
            </div>
            <div className="w-12 h-0.5 bg-primary" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-foreground">Select Reports</span>
            </div>
            <div className="w-12 h-0.5 bg-primary" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="text-sm font-medium text-foreground">Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 py-8 md:py-12 md:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              Complete Payment
            </h1>
            <p className="text-muted-foreground">
              Secure payment powered by 256-bit SSL encryption
            </p>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Credit Reports ({selectedBureaus.length} bureaus)</span>
                  <span className="font-medium">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (GST)</span>
                  <span className="font-medium">Included</span>
                </div>
                <div className="pt-3 border-t border-border flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary flex items-center">
                    <IndianRupee className="w-5 h-5" />{totalAmount}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Select Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === method.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-muted-foreground/50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        paymentMethod === method.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-foreground">{method.name}</p>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="mb-6">
              <CardContent className="pt-6">
                {paymentMethod === 'upi' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Enter UPI ID</label>
                    <Input
                      placeholder="example@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Card Number</label>
                      <Input placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Expiry</label>
                        <Input placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">CVV</label>
                        <Input placeholder="123" type="password" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Select Bank</label>
                    <select className="w-full p-3 border border-border rounded-lg bg-background text-foreground">
                      <option>State Bank of India</option>
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Bank</option>
                    </select>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Pay Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={handlePayment}
              size="lg"
              className="w-full gap-2 h-14 text-lg"
              disabled={isProcessing || (paymentMethod === 'upi' && !upiId)}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Pay ₹{totalAmount} Securely
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              Secured by 256-bit SSL encryption
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
