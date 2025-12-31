import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wrench, Phone, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ScoreRepairCTAProps {
  currentScore: number;
  userName?: string;
  userPhone?: string;
}

export default function ScoreRepairCTA({ currentScore, userName, userPhone }: ScoreRepairCTAProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: userName || '',
    phone: userPhone || '',
    targetScore: ''
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Request submitted! Our team will contact you within 24 hours.');
    setIsDialogOpen(false);
    setIsSubmitting(false);
  };

  const benefits = [
    'Expert credit counseling',
    'Dispute resolution assistance',
    'Personalized improvement plan',
    '24/7 support'
  ];

  return (
    <>
      <Card className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
              <Wrench className="w-8 h-8" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold mb-2">Need Help Improving Your Score?</h3>
              <p className="text-white/80 text-sm mb-4">
                Our experts can help you improve your credit score from {currentScore} to 750+.
                Get personalized guidance and dispute assistance.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {benefits.map((benefit, index) => (
                  <motion.span
                    key={benefit}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded-full"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {benefit}
                  </motion.span>
                ))}
              </div>
            </div>

            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-white text-amber-600 hover:bg-white/90 gap-2 shrink-0"
            >
              Get Free Consultation
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-primary" />
              Score Repair Consultation
            </DialogTitle>
            <DialogDescription>
              Fill in your details and our credit experts will contact you within 24 hours.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted/50 rounded-xl text-center">
              <p className="text-sm text-muted-foreground">Current Score</p>
              <p className="text-3xl font-bold text-foreground">{currentScore}</p>
              <p className="text-sm text-accent mt-1">Target: 750+</p>
            </div>

            <div>
              <Label>Full Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Phone Number *</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 XXXXXXXXXX"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Target Score (Optional)</Label>
              <Input
                value={formData.targetScore}
                onChange={(e) => setFormData({ ...formData, targetScore: e.target.value })}
                placeholder="e.g., 750"
                className="mt-1"
              />
            </div>

            <Button 
              onClick={handleSubmit} 
              className="w-full gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4" />
                  Request Callback
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By submitting, you agree to be contacted by our team.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
