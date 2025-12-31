import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, TrendingUp, AlertCircle, Lightbulb } from 'lucide-react';

interface ImprovementTipsProps {
  score: number;
  tips?: string[];
}

export default function ImprovementTips({ score, tips }: ImprovementTipsProps) {
  const defaultTips = [
    { 
      title: 'Pay Bills on Time',
      description: 'Payment history is the most important factor. Set up auto-pay to never miss a due date.',
      impact: 'High',
      icon: CheckCircle2
    },
    {
      title: 'Keep Credit Utilization Low',
      description: 'Try to use less than 30% of your available credit limit across all cards.',
      impact: 'High',
      icon: TrendingUp
    },
    {
      title: 'Avoid Multiple Hard Enquiries',
      description: 'Each hard enquiry can lower your score. Space out credit applications.',
      impact: 'Medium',
      icon: AlertCircle
    },
    {
      title: 'Maintain Old Credit Accounts',
      description: 'Length of credit history matters. Keep your oldest accounts active.',
      impact: 'Medium',
      icon: Lightbulb
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-accent/10 text-accent';
      case 'Medium': return 'bg-amber-500/10 text-amber-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          Tips to Improve Your Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {defaultTips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 p-4 bg-muted/30 rounded-xl"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground">{tip.title}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getImpactColor(tip.impact)}`}>
                      {tip.impact} Impact
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {tips && tips.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <h4 className="font-medium text-foreground mb-3">Personalized Recommendations</h4>
            <ul className="space-y-2">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
