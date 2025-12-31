import React from 'react';
import { format } from 'date-fns';
import { CreditReport, Loan } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, Phone, MapPin, Briefcase, Building2, 
  CreditCard, Calendar, IndianRupee, AlertTriangle,
  CheckCircle2, XCircle, Clock
} from 'lucide-react';

interface FullCreditReportViewProps {
  report: CreditReport;
  bureauName?: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const getScoreColor = (score: number) => {
  if (score >= 750) return 'text-emerald-600';
  if (score >= 650) return 'text-teal-600';
  if (score >= 550) return 'text-amber-600';
  return 'text-red-600';
};

const getScoreBgColor = (score: number) => {
  if (score >= 750) return 'bg-emerald-500';
  if (score >= 650) return 'bg-teal-500';
  if (score >= 550) return 'bg-amber-500';
  return 'bg-red-500';
};

const getScoreCategory = (score: number) => {
  if (score >= 750) return 'Excellent';
  if (score >= 700) return 'Very Good';
  if (score >= 650) return 'Good';
  if (score >= 550) return 'Average';
  return 'Poor';
};

const getDPDColor = (dpd: number) => {
  if (dpd === 0) return 'bg-emerald-500 text-white';
  if (dpd <= 30) return 'bg-amber-500 text-white';
  if (dpd <= 60) return 'bg-orange-500 text-white';
  if (dpd <= 90) return 'bg-red-400 text-white';
  return 'bg-red-600 text-white';
};

const getDPDLabel = (dpd: number, status?: string) => {
  if (status === 'STD' || dpd === 0) return 'STD';
  if (status === 'SMA') return 'SMA';
  if (status === 'SUB') return 'SUB';
  return `${dpd}`;
};

export default function FullCreditReportView({ report, bureauName = 'TransUnion CIBIL' }: FullCreditReportViewProps) {
  const controlNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
  const allAccounts = [
    ...(report.active_loans || []),
    ...(report.closed_loans || []),
  ];
  
  const creditCardAccounts = (report.credit_cards || []).map(card => ({
    loan_type: 'Credit Card',
    lender: card.bank,
    account_number: `XXXX${Math.floor(Math.random() * 9000) + 1000}`,
    sanctioned_amount: card.credit_limit,
    current_balance: card.current_balance,
    emi_amount: 0,
    tenure_months: 0,
    start_date: report.created_date,
    status: card.status,
    overdue_amount: 0,
    rate_of_interest: 'Revolving',
    payment_history: card.payment_history || [],
  }));

  const allLoanAccounts = [...allAccounts, ...creditCardAccounts];

  // Calculate totals
  const totalSanctioned = allLoanAccounts.reduce((sum, acc) => sum + (acc.sanctioned_amount || 0), 0);
  const totalCurrentBalance = allLoanAccounts.reduce((sum, acc) => sum + (acc.current_balance || 0), 0);
  const totalOverdue = allLoanAccounts.reduce((sum, acc) => sum + (acc.overdue_amount || 0), 0);

  return (
    <div className="space-y-6 print:space-y-4" id="credit-report-pdf">
      {/* Header Section */}
      <Card className="border-2 border-primary/30 overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">{bureauName}</h1>
              <p className="text-primary-foreground/80 text-sm mt-1">Credit Information Report</p>
              <p className="text-primary-foreground/60 text-xs mt-2">
                Control Number: {controlNumber}
              </p>
            </div>
            <div className="text-right">
              <p className="text-primary-foreground/80 text-sm">Report Date</p>
              <p className="text-lg font-semibold">
                {format(new Date(report.report_generated_at || report.created_date), 'dd MMM yyyy')}
              </p>
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-muted-foreground text-sm mb-1">Credit Score</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-5xl font-bold ${getScoreColor(report.average_score)}`}>
                  {report.average_score}
                </span>
                <span className="text-muted-foreground">/ 900</span>
              </div>
              <Badge className={`mt-2 ${getScoreBgColor(report.average_score)} text-white`}>
                {getScoreCategory(report.average_score)}
              </Badge>
            </div>
            <div className="w-full md:w-64 h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full ${getScoreBgColor(report.average_score)} transition-all`}
                style={{ width: `${((report.average_score - 300) / 600) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal & Contact Information */}
      <Card>
        <CardHeader className="bg-muted/50 py-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4" /> Personal & Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Name</p>
              <p className="font-semibold text-foreground">{report.full_name}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Date of Birth</p>
              <p className="font-medium">{report.date_of_birth || 'Not Reported'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Gender</p>
              <p className="font-medium">{report.gender || 'Not Reported'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">PAN Number</p>
              <p className="font-mono font-semibold">{report.pan_number}</p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-muted-foreground text-xs">Mobile Number</p>
                <p className="font-medium">{report.mobile || 'Not Reported'}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-muted-foreground text-xs">Address (As Reported)</p>
                <p className="font-medium">{report.address || 'Not Reported'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employment Information */}
      <Card>
        <CardHeader className="bg-muted/50 py-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Employment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Occupation Type</p>
              <p className="font-medium">Salaried / Self-Employed</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Income (Monthly)</p>
              <p className="font-medium">Not Reported</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Employer</p>
              <p className="font-medium">Not Reported</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Summary */}
      <Card>
        <CardHeader className="bg-muted/50 py-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Account Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-primary/5 rounded-lg text-center">
              <p className="text-2xl font-bold text-primary">{report.total_accounts}</p>
              <p className="text-xs text-muted-foreground">Total Accounts</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-emerald-600">{report.active_accounts}</p>
              <p className="text-xs text-muted-foreground">Active Accounts</p>
            </div>
            <div className="p-3 bg-muted rounded-lg text-center">
              <p className="text-2xl font-bold text-muted-foreground">{report.closed_accounts}</p>
              <p className="text-xs text-muted-foreground">Closed Accounts</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalOverdue)}</p>
              <p className="text-xs text-muted-foreground">Total Overdue</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Details - Each Account */}
      <Card>
        <CardHeader className="bg-muted/50 py-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Account Information (Detailed)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-6">
          {allLoanAccounts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No account information available</p>
          ) : (
            allLoanAccounts.map((account, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                {/* Account Header */}
                <div className="bg-muted/30 p-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{account.lender}</h3>
                      <Badge variant="outline" className="text-xs">
                        {account.loan_type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Account: {account.account_number}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {account.overdue_amount > 0 ? (
                      <Badge className="bg-red-100 text-red-700 gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Overdue: {formatCurrency(account.overdue_amount)}
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-100 text-emerald-700 gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {account.status || 'Active'}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Account Details Grid */}
                <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-b">
                  <div>
                    <p className="text-muted-foreground text-xs">Sanctioned Amount</p>
                    <p className="font-semibold">{formatCurrency(account.sanctioned_amount || 0)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Current Balance</p>
                    <p className="font-semibold">{formatCurrency(account.current_balance || 0)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">EMI Amount</p>
                    <p className="font-semibold">
                      {account.emi_amount ? formatCurrency(account.emi_amount) : '---'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Rate of Interest</p>
                    <p className="font-semibold">{account.rate_of_interest || 'Not Reported'}</p>
                  </div>
                </div>

                <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-b">
                  <div>
                    <p className="text-muted-foreground text-xs">Date Opened</p>
                    <p className="font-medium">
                      {account.start_date ? format(new Date(account.start_date), 'dd MMM yyyy') : '---'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Date Closed</p>
                    <p className="font-medium">
                      {'closed_date' in account && account.closed_date 
                        ? format(new Date(account.closed_date as string), 'dd MMM yyyy') 
                        : '---'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Tenure</p>
                    <p className="font-medium">
                      {account.tenure_months ? `${account.tenure_months} Months` : '---'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Amount Overdue</p>
                    <p className={`font-semibold ${account.overdue_amount > 0 ? 'text-red-600' : ''}`}>
                      {formatCurrency(account.overdue_amount || 0)}
                    </p>
                  </div>
                </div>

                {/* Payment History (36 Months) */}
                {account.payment_history && account.payment_history.length > 0 && (
                  <div className="p-4">
                    <p className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Payment History (Last 36 Months) - Days Past Due (DPD)
                    </p>
                    <div className="overflow-x-auto">
                      <div className="min-w-max">
                        {/* Group by year */}
                        {(() => {
                          const historyByYear: Record<number, typeof account.payment_history> = {};
                          account.payment_history.forEach(ph => {
                            if (!historyByYear[ph.year]) historyByYear[ph.year] = [];
                            historyByYear[ph.year].push(ph);
                          });
                          
                          const years = Object.keys(historyByYear).sort((a, b) => Number(b) - Number(a));
                          const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                          
                          return (
                            <table className="w-full text-xs">
                              <thead>
                                <tr>
                                  <th className="text-left p-1 text-muted-foreground font-medium">Year</th>
                                  {months.map(m => (
                                    <th key={m} className="p-1 text-center text-muted-foreground font-medium w-8">{m}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {years.slice(0, 3).map(year => (
                                  <tr key={year}>
                                    <td className="p-1 font-medium">{year}</td>
                                    {months.map(month => {
                                      const payment = historyByYear[Number(year)]?.find(p => p.month === month);
                                      return (
                                        <td key={month} className="p-1 text-center">
                                          {payment ? (
                                            <span className={`inline-block w-6 h-6 rounded text-[10px] font-medium leading-6 ${getDPDColor(payment.dpd)}`}>
                                              {getDPDLabel(payment.dpd, payment.status)}
                                            </span>
                                          ) : (
                                            <span className="inline-block w-6 h-6 rounded bg-muted text-muted-foreground text-[10px] leading-6">---</span>
                                          )}
                                        </td>
                                      );
                                    })}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-3 text-xs">
                      <span className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded bg-emerald-500"></span> STD (Standard)
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded bg-amber-500"></span> 1-30 DPD
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded bg-orange-500"></span> 31-60 DPD
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded bg-red-400"></span> 61-90 DPD
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded bg-red-600"></span> 90+ DPD
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Enquiry Details */}
      {report.enquiry_details && report.enquiry_details.length > 0 && (
        <Card>
          <CardHeader className="bg-muted/50 py-3">
            <CardTitle className="text-base">Enquiry Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 text-muted-foreground font-medium">Date</th>
                    <th className="text-left p-2 text-muted-foreground font-medium">Institution</th>
                    <th className="text-left p-2 text-muted-foreground font-medium">Purpose</th>
                    <th className="text-right p-2 text-muted-foreground font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {report.enquiry_details.map((enq, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="p-2">{format(new Date(enq.date), 'dd MMM yyyy')}</td>
                      <td className="p-2 font-medium">{enq.institution}</td>
                      <td className="p-2">{enq.purpose}</td>
                      <td className="p-2 text-right">{formatCurrency(enq.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Final Summary */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-primary/5 py-3">
          <CardTitle className="text-base">Report Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Total Accounts</p>
              <p className="text-xl font-bold text-foreground">{report.total_accounts}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Active Accounts</p>
              <p className="text-xl font-bold text-emerald-600">{report.active_accounts}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Total Sanctioned</p>
              <p className="text-xl font-bold text-foreground">{formatCurrency(totalSanctioned)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Total Overdue</p>
              <p className={`text-xl font-bold ${totalOverdue > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {formatCurrency(totalOverdue)}
              </p>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Credit Utilization</span>
            <span className="font-semibold">{report.credit_utilization}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
            <div 
              className={`h-full rounded-full ${report.credit_utilization > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${report.credit_utilization}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="text-xs text-muted-foreground text-center p-4 bg-muted/30 rounded-lg">
        <p>This credit report is generated based on data available with the credit bureau as of the report date.</p>
        <p className="mt-1">For disputes or corrections, please contact the respective credit bureau directly.</p>
      </div>
    </div>
  );
}
