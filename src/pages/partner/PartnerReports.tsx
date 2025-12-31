import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { FileText, Search, Download, Eye, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PartnerSidebar from '@/components/partner/PartnerSidebar';
import PartnerReportHistory from '@/components/partner/PartnerReportHistory';
import { mockCreditReports, bureauConfig } from '@/data/mockData';

export default function PartnerReports() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bureauFilter, setBureauFilter] = useState('all');

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
              <PartnerReportHistory 
                reports={filteredReports} 
                onViewReport={(reportId) => navigate(createPageUrl('CreditReport') + `?reportId=${reportId}`)}
              />
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
