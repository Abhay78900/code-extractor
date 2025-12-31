import React, { useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Printer, X } from 'lucide-react';
import { CreditReport } from '@/types';
import FullCreditReportView from '@/components/credit/FullCreditReportView';

interface FullReportModalProps {
  report: CreditReport | null;
  isOpen: boolean;
  onClose: () => void;
  bureauName?: string;
}

export default function FullReportModal({
  report,
  isOpen,
  onClose,
  bureauName = 'TransUnion CIBIL',
}: FullReportModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!report) return null;

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Credit Report - ${report.full_name}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; }
            .space-y-6 > * + * { margin-top: 1.5rem; }
            .space-y-4 > * + * { margin-top: 1rem; }
            .grid { display: grid; gap: 1rem; }
            .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
            .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
            .flex { display: flex; }
            .items-center { align-items: center; }
            .justify-between { justify-content: space-between; }
            .gap-2 { gap: 0.5rem; }
            .gap-4 { gap: 1rem; }
            .p-4 { padding: 1rem; }
            .p-3 { padding: 0.75rem; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .font-bold { font-weight: 700; }
            .font-semibold { font-weight: 600; }
            .font-medium { font-weight: 500; }
            .text-2xl { font-size: 1.5rem; }
            .text-xl { font-size: 1.25rem; }
            .text-sm { font-size: 0.875rem; }
            .text-xs { font-size: 0.75rem; }
            .rounded-lg { border-radius: 0.5rem; }
            .border { border: 1px solid #e5e7eb; }
            .border-b { border-bottom: 1px solid #e5e7eb; }
            .bg-gray-50 { background-color: #f9fafb; }
            .bg-emerald-500 { background-color: #10b981; }
            .text-emerald-600 { color: #059669; }
            .text-red-600 { color: #dc2626; }
            .text-gray-500 { color: #6b7280; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 0.5rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
            @media print {
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    const reportData = {
      header: {
        bureau_name: bureauName,
        report_date: report.report_generated_at || report.created_date,
        control_number: Math.floor(Math.random() * 9000000000) + 1000000000,
        credit_score: report.average_score,
      },
      personal_information: {
        full_name: report.full_name,
        date_of_birth: report.date_of_birth || 'Not Reported',
        gender: report.gender || 'Not Reported',
        pan_number: report.pan_number,
        mobile: report.mobile || 'Not Reported',
        address: report.address || 'Not Reported',
      },
      account_summary: {
        total_accounts: report.total_accounts,
        active_accounts: report.active_accounts,
        closed_accounts: report.closed_accounts,
        credit_utilization: `${report.credit_utilization}%`,
      },
      accounts: [
        ...(report.active_loans || []).map(loan => ({
          account_type: loan.loan_type,
          member_name: loan.lender,
          account_number: loan.account_number,
          sanctioned_amount: loan.sanctioned_amount,
          current_balance: loan.current_balance,
          emi_amount: loan.emi_amount,
          rate_of_interest: loan.rate_of_interest,
          date_opened: loan.start_date,
          date_closed: loan.closed_date || null,
          amount_overdue: loan.overdue_amount,
          payment_history: loan.payment_history,
        })),
        ...(report.credit_cards || []).map(card => ({
          account_type: 'Credit Card',
          member_name: card.bank,
          credit_limit: card.credit_limit,
          current_balance: card.current_balance,
          utilization: `${card.utilization}%`,
          status: card.status,
          payment_history: card.payment_history,
        })),
      ],
      enquiries: report.enquiry_details,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `credit_report_${report.pan_number}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] p-0">
        <DialogHeader className="p-4 border-b flex flex-row items-center justify-between">
          <DialogTitle>Credit Report - {report.full_name}</DialogTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-1" /> JSON
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-1" /> Print
            </Button>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(95vh-80px)]">
          <div className="p-6" ref={printRef}>
            <FullCreditReportView report={report} bureauName={bureauName} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
