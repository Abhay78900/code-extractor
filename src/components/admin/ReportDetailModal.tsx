import React from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  User,
  CreditCard,
  Phone,
  Mail,
  Calendar,
} from 'lucide-react';

interface Report {
  id: string;
  full_name?: string;
  pan_number?: string;
  mobile?: string;
  user_email?: string;
  date_of_birth?: string;
  average_score?: number;
  created_date: string;
  credit_utilization?: number;
  is_high_risk?: boolean;
}

interface ReportDetailModalProps {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportDetailModal({
  report,
  isOpen,
  onClose,
}: ReportDetailModalProps) {
  if (!report) return null;

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-emerald-600';
    if (score >= 650) return 'text-teal-600';
    if (score >= 500) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Report Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground">{report.full_name}</h3>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CreditCard className="w-4 h-4" /> {report.pan_number}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" /> {report.mobile}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" /> {report.user_email}
                </span>
              </div>
            </div>
            {report.is_high_risk && (
              <Badge className="bg-red-100 text-red-700">High Risk</Badge>
            )}
          </div>

          {/* Credit Score */}
          <div className="bg-gradient-navy rounded-xl p-6 text-center">
            <p className="text-primary-foreground/70 text-sm mb-2">Credit Score</p>
            <p className={`text-5xl font-bold ${getScoreColor(report.average_score || 0)} text-primary-foreground`}>
              {report.average_score}
            </p>
            <p className="text-primary-foreground/70 mt-2">/ 900</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-xl">
              <p className="text-sm text-muted-foreground">Credit Utilization</p>
              <p className="text-2xl font-bold text-foreground">{report.credit_utilization || 0}%</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-xl">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Report Date
              </p>
              <p className="text-lg font-semibold text-foreground">
                {format(new Date(report.created_date), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
