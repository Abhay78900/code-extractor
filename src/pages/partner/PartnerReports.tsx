import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { FileText, Search, Download, Eye, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PartnerSidebar from '@/components/partner/PartnerSidebar';
import FullReportModal from '@/components/admin/FullReportModal';
import { mockCreditReports, bureauConfig } from '@/data/mockData';
import { CreditReport } from '@/types';

export default function PartnerReports() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bureauFilter, setBureauFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<CreditReport | null>(null);

  const partnerReports = mockCreditReports.filter(r => r.initiated_by === 'partner');

  const filteredReports = partnerReports.filter(report => {
    const matchesSearch = 
      report.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.pan_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.report_status === statusFilter;
    const matchesBureau = bureauFilter === 'all' || report.bureaus_checked.includes(bureauFilter);
    return matchesSearch && matchesStatus && matchesBureau;
  });

  const handleLogout = () => {
    sessionStorage.clear();
    navigate(createPageUrl('Home'));
  };

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-accent';
    if (score >= 650) return 'text-amber-500';
    return 'text-destructive';
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      <PartnerSidebar onLogout={handleLogout} />
      
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Reports</h1>
              <p className="text-muted-foreground">View and manage all generated reports</p>
            </div>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or PAN..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="UNLOCKED">Unlocked</SelectItem>
                    <SelectItem value="LOCKED">Locked</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={bureauFilter} onValueChange={setBureauFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Bureau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bureaus</SelectItem>
                    {Object.entries(bureauConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-foreground">{partnerReports.length}</p>
                <p className="text-sm text-muted-foreground">Total Reports</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-accent">{partnerReports.filter(r => r.report_status === 'UNLOCKED').length}</p>
                <p className="text-sm text-muted-foreground">Unlocked</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-amber-500">{partnerReports.filter(r => r.report_status === 'LOCKED').length}</p>
                <p className="text-sm text-muted-foreground">Locked</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-primary">{Math.round(partnerReports.reduce((sum, r) => sum + r.average_score, 0) / partnerReports.length) || 0}</p>
                <p className="text-sm text-muted-foreground">Avg Score</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Report History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>PAN</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Bureaus</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-mono text-sm">{report.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{report.full_name}</p>
                          <p className="text-sm text-muted-foreground">{report.user_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{report.pan_number}</TableCell>
                      <TableCell>
                        <span className={`font-bold ${getScoreColor(report.average_score)}`}>
                          {report.average_score}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {report.bureaus_checked.slice(0, 4).map((bureau, idx) => (
                            <span key={idx} className="text-lg" title={bureau}>
                              {bureauConfig[bureau.toLowerCase().split(' ')[0] as keyof typeof bureauConfig]?.logo || '📊'}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(report.created_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={report.report_status === 'UNLOCKED' ? 'default' : 'secondary'}>
                          {report.report_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedReport(report)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        <FullReportModal
          report={selectedReport}
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          referrer="partner"
        />
      </main>
    </div>
  );
}
