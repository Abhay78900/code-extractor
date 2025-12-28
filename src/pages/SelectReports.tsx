import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  CreditCard,
  ArrowLeft,
  ArrowRight,
  Shield,
  Check,
  IndianRupee,
} from 'lucide-react';
import { toast } from 'sonner';

const bureaus = [
  { id: 'cibil', name: 'TransUnion CIBIL', logo: '🔵', color: 'border-blue-500 bg-blue-50', price: 99 },
  { id: 'experian', name: 'Experian', logo: '🟣', color: 'border-purple-500 bg-purple-50', price: 99 },
  { id: 'equifax', name: 'Equifax', logo: '🔴', color: 'border-red-500 bg-red-50', price: 99 },
  { id: 'crif', name: 'CRIF High Mark', logo: '🟢', color: 'border-green-500 bg-green-50', price: 99 },
];

export default function SelectReports() {
  const navigate = useNavigate();
  const [selectedBureaus, setSelectedBureaus] = useState<string[]>([]);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    const data = sessionStorage.getItem('creditCheckFormData');
    if (!data) {
      toast.error('Please fill in your details first');
      navigate('/check-score');
      return;
    }
    setFormData(JSON.parse(data));
  }, [navigate]);

  const toggleBureau = (id: string) => {
    setSelectedBureaus(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedBureaus(bureaus.map(b => b.id));
  };

  const totalAmount = selectedBureaus.length * 99;

  const handleProceed = () => {
    if (selectedBureaus.length === 0) {
      toast.error('Please select at least one bureau');
      return;
    }

    sessionStorage.setItem('selectedBureaus', JSON.stringify(selectedBureaus));
    sessionStorage.setItem('totalAmount', String(totalAmount));
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 py-4 md:px-8 border-b border-border bg-card">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/check-score')}>
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
                2
              </div>
              <span className="text-sm font-medium text-foreground">Select Reports</span>
            </div>
            <div className="w-12 h-0.5 bg-muted-foreground/30" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="text-sm text-muted-foreground">Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 py-8 md:py-12 md:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              Select Credit Bureaus
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Choose which credit bureaus you want to get your report from. We recommend selecting all 4 for a complete picture.
            </p>
          </motion.div>

          {/* Select All Button */}
          <div className="flex justify-end mb-4">
            <Button variant="outline" size="sm" onClick={selectAll}>
              Select All (₹{bureaus.length * 99})
            </Button>
          </div>

          {/* Bureau Cards */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {bureaus.map((bureau, index) => {
              const isSelected = selectedBureaus.includes(bureau.id);
              return (
                <motion.div
                  key={bureau.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    onClick={() => toggleBureau(bureau.id)}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? `border-2 ${bureau.color}`
                        : 'border-2 border-transparent hover:border-muted-foreground/30'
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">{bureau.logo}</div>
                          <div>
                            <h3 className="font-semibold text-foreground">{bureau.name}</h3>
                            <p className="text-sm text-muted-foreground">Credit Score & Report</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-foreground">₹{bureau.price}</p>
                          </div>
                          <Checkbox checked={isSelected} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Summary & Proceed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-navy text-primary-foreground">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-primary-foreground/70 text-sm">Total Amount</p>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-6 h-6" />
                      <span className="text-4xl font-bold">{totalAmount}</span>
                    </div>
                    <p className="text-sm text-primary-foreground/70 mt-1">
                      {selectedBureaus.length} bureau(s) selected
                    </p>
                  </div>
                  <Button
                    onClick={handleProceed}
                    size="lg"
                    variant="secondary"
                    className="gap-2 px-8"
                    disabled={selectedBureaus.length === 0}
                  >
                    Proceed to Payment <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
