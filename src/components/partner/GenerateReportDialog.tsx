import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CreditCard, User, Phone, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const bureaus = [
  { id: 'cibil', name: 'CIBIL', logo: '🔵', price: 99 },
  { id: 'experian', name: 'Experian', logo: '🟣', price: 99 },
  { id: 'equifax', name: 'Equifax', logo: '🔴', price: 99 },
  { id: 'crif', name: 'CRIF', logo: '🟢', price: 99 },
];

interface GenerateReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (clientData: { full_name: string; pan_number: string; mobile: string; date_of_birth: string }, bureaus: string[]) => Promise<void>;
  walletBalance: number;
}

export default function GenerateReportDialog({ isOpen, onClose, onGenerate, walletBalance }: GenerateReportDialogProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [clientData, setClientData] = useState({
    full_name: '',
    pan_number: '',
    mobile: '',
    date_of_birth: '',
  });
  const [selectedBureaus, setSelectedBureaus] = useState<string[]>([]);

  const totalAmount = selectedBureaus.length * 99;
  const hasInsufficientBalance = totalAmount > walletBalance;

  const toggleBureau = (id: string) => {
    setSelectedBureaus(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (!clientData.full_name || !clientData.pan_number || !clientData.mobile) {
      toast.error('Please fill all required fields');
      return;
    }
    setStep(2);
  };

  const handleGenerate = async () => {
    if (selectedBureaus.length === 0) {
      toast.error('Please select at least one bureau');
      return;
    }
    if (hasInsufficientBalance) {
      toast.error('Insufficient wallet balance');
      return;
    }

    setIsLoading(true);
    try {
      await onGenerate(clientData, selectedBureaus);
      toast.success('Report generated successfully!');
      onClose();
      setStep(1);
      setClientData({ full_name: '', pan_number: '', mobile: '', date_of_birth: '' });
      setSelectedBureaus([]);
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Generate Credit Report</DialogTitle>
          <DialogDescription>
            {step === 1 ? 'Enter client details' : 'Select credit bureaus'}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name (as per PAN)</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="full_name"
                  placeholder="Enter client's full name"
                  value={clientData.full_name}
                  onChange={(e) => setClientData({ ...clientData, full_name: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pan_number">PAN Number</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="pan_number"
                  placeholder="ABCDE1234F"
                  value={clientData.pan_number}
                  onChange={(e) => setClientData({ ...clientData, pan_number: e.target.value.toUpperCase() })}
                  className="pl-10 uppercase"
                  maxLength={10}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="mobile"
                  placeholder="9876543210"
                  value={clientData.mobile}
                  onChange={(e) => setClientData({ ...clientData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="date_of_birth"
                  type="date"
                  value={clientData.date_of_birth}
                  onChange={(e) => setClientData({ ...clientData, date_of_birth: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <Button onClick={handleNext} className="w-full" size="lg">
              Continue
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              {bureaus.map((bureau) => (
                <div
                  key={bureau.id}
                  onClick={() => toggleBureau(bureau.id)}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedBureaus.includes(bureau.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox checked={selectedBureaus.includes(bureau.id)} />
                    <span className="text-xl">{bureau.logo}</span>
                    <span className="font-medium">{bureau.name}</span>
                  </div>
                  <span className="font-semibold">₹{bureau.price}</span>
                </div>
              ))}
            </div>

            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="text-xl font-bold">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-muted-foreground">Wallet Balance</span>
                <span className={hasInsufficientBalance ? 'text-destructive' : 'text-foreground'}>
                  ₹{walletBalance.toLocaleString()}
                </span>
              </div>
            </div>

            {hasInsufficientBalance && (
              <p className="text-sm text-destructive text-center">
                Insufficient wallet balance. Please add funds.
              </p>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isLoading || selectedBureaus.length === 0 || hasInsufficientBalance}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  `Generate (₹${totalAmount})`
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
