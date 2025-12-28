import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Users, FileText, TrendingUp, IndianRupee, Building2, Settings, Wrench, CreditCard, Search, Plus, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MasterAdminSidebar from '@/components/admin/MasterAdminSidebar';
import StatsCard from '@/components/admin/StatsCard';
import UserTable from '@/components/admin/UserTable';
import ReportDetailModal from '@/components/admin/ReportDetailModal';
import { mockCreditReports, mockTransactions, mockPartners, mockUsers, mockScoreRepairRequests } from '@/data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Badge } from '@/components/ui/badge';

export default function MasterAdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    sessionStorage.clear();
    navigate(createPageUrl('Home'));
  };

  const allReports = mockCreditReports;
  const allTxns = mockTransactions;

  const totalRevenue = allTxns.filter(t => t.status === 'success').reduce((sum, t) => sum + t.amount, 0);
  const totalReports = allReports.length;
  const totalUsers = mockUsers.length;
  const activePartners = mockPartners.filter(p => p.status === 'active').length;

  const chartData = Array.from({ length: 7 }, (_, i) => ({
    date: format(new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000), 'MMM d'),
    revenue: Math.floor(Math.random() * 5000) + 1000,
    reports: Math.floor(Math.random() * 20) + 5,
  }));

  const currentPath = location.pathname;

  const filteredReports = allReports.filter(r =>
    r.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.pan_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex">
      <MasterAdminSidebar currentPage="MasterAdminDashboard" onLogout={handleLogout} />

      <main className="flex-1 px-6 py-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-display font-bold text-foreground">Master Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Admin</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={IndianRupee} color="emerald" delay={0} />
            <StatsCard title="Total Users" value={totalUsers} icon={Users} color="blue" delay={0.1} />
            <StatsCard title="Reports Generated" value={totalReports} icon={FileText} color="purple" delay={0.2} />
            <StatsCard title="Active Partners" value={`${activePartners}/${mockPartners.length}`} icon={Building2} color="teal" delay={0.3} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Revenue (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {allReports.slice(0, 5).map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted" onClick={() => setSelectedReport(report)}>
                        <div>
                          <p className="font-medium text-foreground">{report.full_name}</p>
                          <p className="text-sm text-muted-foreground">{report.pan_number}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">{report.average_score}</p>
                          <Badge className={report.average_score >= 750 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                            {report.score_category}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-foreground">All Reports</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 w-64" />
              </div>
            </div>
            <UserTable reports={filteredReports} onViewReport={setSelectedReport} onDownload={() => {}} />
          </div>
        </div>
      </main>

      <ReportDetailModal report={selectedReport} isOpen={!!selectedReport} onClose={() => setSelectedReport(null)} />
    </div>
  );
}
