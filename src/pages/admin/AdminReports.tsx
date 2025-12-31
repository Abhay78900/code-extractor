import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { FileText, Search, Download, Eye, Filter, BarChart3 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MasterAdminSidebar from '@/components/admin/MasterAdminSidebar';
import FullReportModal from '@/components/admin/FullReportModal';
import { mockCreditReports, bureauConfig } from '@/data/mockData';
import { CreditReport } from '@/types';

export default function AdminReports() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<CreditReport | null>(null);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate(createPageUrl('Home'));
  };

  const filteredReports = mockCreditReports.filter(report => {
    const matchesSearch = 
      report.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.pan_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.report_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-accent';
    if (score >= 650) return 'text-amber-500';
    return 'text-destructive';
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      <MasterAdminSidebar onLogout={handleLogout} />
      
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Reports Repository</h1>
              <p className="text-muted-foreground">View and manage all credit reports</p>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-foreground">{mockCreditReports.length}</p>
                <p className="text-sm text-muted-foreground">Total Reports</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-accent">{mockCreditReports.filter(r => r.report_status === 'UNLOCKED').length}</p>
                <p className="text-sm text-muted-foreground">Unlocked</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-amber-500">{mockCreditReports.filter(r => r.is_high_risk).length}</p>
                <p className="text-sm text-muted-foreground">High Risk</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-primary">{Math.round(mockCreditReports.reduce((sum, r) => sum + r.average_score, 0) / mockCreditReports.length)}</p>
                <p className="text-sm text-muted-foreground">Avg Score</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, PAN, or ID..."
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
              </div>
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
                          {report.bureaus_checked.map(bureau => (
                            <span key={bureau} className="text-lg" title={bureauConfig[bureau as keyof typeof bureauConfig]?.name}>
                              {bureauConfig[bureau as keyof typeof bureauConfig]?.logo}
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
          bureauName="TransUnion CIBIL"
        />
      </main>
    </div>
  );
}
