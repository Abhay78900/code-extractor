import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from 'lucide-react';
import { CreditReport } from '@/types';

interface PartnerReportHistoryProps {
  reports: CreditReport[];
  transactions?: any[];
  onViewReport: (report: CreditReport) => void;
}

export default function PartnerReportHistory({ reports, onViewReport }: PartnerReportHistoryProps) {
  if (!reports || reports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">No reports generated yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Reports</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {reports.slice(0, 10).map((report) => (
            <div key={report.id} className="p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{report.full_name}</p>
                  <p className="text-sm text-muted-foreground">{report.pan_number}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-foreground">{report.average_score}</p>
                    <Badge className={
                      report.average_score >= 750 ? 'bg-emerald-100 text-emerald-700' :
                      report.average_score >= 650 ? 'bg-teal-100 text-teal-700' :
                      'bg-amber-100 text-amber-700'
                    }>
                      {report.score_category}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => onViewReport(report)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {format(new Date(report.created_date), 'MMM d, yyyy HH:mm')}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
