import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, User, CreditCard, Phone, Calendar, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { bureauConfig } from '@/data/mockData';

interface ClientReportFormProps {
  onGenerateReport: (data: any) => Promise<void>;
  walletBalance: number;
}

export default function ClientReportForm({ onGenerateReport, walletBalance }: ClientReportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    panNumber: '',
    mobile: '',
    dateOfBirth: '',
    email: ''
  });
  const [selectedBureaus, setSelectedBureaus] = useState<string[]>([]);

  const bureauPrice = 99;
  const totalCost = selectedBureaus.length * bureauPrice;
  const canAfford = walletBalance >= totalCost;

  const toggleBureau = (bureau: string) => {
    setSelectedBureaus(prev => 
      prev.includes(bureau) 
        ? prev.filter(b => b !== bureau)
        : [...prev, bureau]
    );
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.panNumber || !formData.mobile) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (selectedBureaus.length === 0) {
      toast.error('Please select at least one bureau');
      return;
    }

    if (!canAfford) {
      toast.error('Insufficient wallet balance');
      return;
    }

    // Validate PAN format
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(formData.panNumber.toUpperCase())) {
      toast.error('Please enter a valid PAN number');
      return;
    }

    setIsSubmitting(true);
    try {
      await onGenerateReport({
        ...formData,
        panNumber: formData.panNumber.toUpperCase(),
        bureaus: selectedBureaus,
        totalCost
      });
      
      // Reset form
      setFormData({
        fullName: '',
        panNumber: '',
        mobile: '',
        dateOfBirth: '',
        email: ''
      });
      setSelectedBureaus([]);
      
      toast.success('Report generated successfully!');
    } catch (error) {
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Generate Client Report
        </CardTitle>
        <CardDescription>
          Enter client details to generate a credit report
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Client Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-1">
                <User className="w-3 h-3" />
                Full Name *
              </Label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter client's full name"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="flex items-center gap-1">
                <CreditCard className="w-3 h-3" />
                PAN Number *
              </Label>
              <Input
                value={formData.panNumber}
                onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                placeholder="ABCDE1234F"
                maxLength={10}
                className="mt-1 uppercase"
              />
            </div>
            <div>
              <Label className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                Mobile Number *
              </Label>
              <Input
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="+91 XXXXXXXXXX"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Date of Birth
              </Label>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          {/* Bureau Selection */}
          <div>
            <Label className="mb-3 block">Select Bureaus (₹{bureauPrice} each)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(bureauConfig).map(([key, config]) => (
                <motion.div
                  key={key}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleBureau(key)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedBureaus.includes(key)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{config.logo}</span>
                    <Checkbox checked={selectedBureaus.includes(key)} />
                  </div>
                  <p className="font-medium text-foreground text-sm">{config.name}</p>
                  <p className="text-xs text-muted-foreground">₹{bureauPrice}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 bg-muted/50 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Selected Bureaus</span>
              <span className="font-medium text-foreground">{selectedBureaus.length}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Cost per Bureau</span>
              <span className="font-medium text-foreground">₹{bureauPrice}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="font-medium text-foreground">Total Cost</span>
              <span className="text-xl font-bold text-primary">₹{totalCost}</span>
            </div>
            {!canAfford && totalCost > 0 && (
              <p className="text-sm text-destructive mt-2">
                Insufficient balance. Please add ₹{totalCost - walletBalance} to your wallet.
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || selectedBureaus.length === 0 || !canAfford}
            className="w-full gap-2"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Generate Report (₹{totalCost})
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
