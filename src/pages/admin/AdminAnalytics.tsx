import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, FileText, IndianRupee, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import MasterAdminSidebar from '@/components/admin/MasterAdminSidebar';
import { mockCreditReports, mockTransactions, mockPartners } from '@/data/mockData';

export default function AdminAnalytics() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('7days');

  const handleLogout = () => {
    sessionStorage.clear();
    navigate(createPageUrl('Home'));
  };

  // Generate analytics data
  const revenueData = [
    { day: 'Mon', revenue: 12500, reports: 45 },
    { day: 'Tue', revenue: 18200, reports: 62 },
    { day: 'Wed', revenue: 15800, reports: 54 },
    { day: 'Thu', revenue: 22100, reports: 78 },
    { day: 'Fri', revenue: 19500, reports: 68 },
    { day: 'Sat', revenue: 8900, reports: 32 },
    { day: 'Sun', revenue: 6200, reports: 22 },
  ];

  const bureauData = [
    { name: 'CIBIL', value: 45, color: '#3b82f6' },
    { name: 'Experian', value: 28, color: '#8b5cf6' },
    { name: 'Equifax', value: 18, color: '#ef4444' },
    { name: 'CRIF', value: 9, color: '#22c55e' },
  ];

  const scoreDistribution = [
    { range: '300-450', count: 120 },
    { range: '451-550', count: 340 },
    { range: '551-650', count: 580 },
    { range: '651-750', count: 890 },
    { range: '751-900', count: 450 },
  ];

  const totalRevenue = mockTransactions.filter(t => t.status === 'success').reduce((sum, t) => sum + t.amount, 0);
  const totalReports = mockCreditReports.length;
  const avgScore = Math.round(mockCreditReports.reduce((sum, r) => sum + r.average_score, 0) / mockCreditReports.length);

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
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Analytics</h1>
              <p className="text-muted-foreground">Detailed insights and performance metrics</p>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-foreground">₹{totalRevenue.toLocaleString()}</p>
                    <div className="flex items-center gap-1 text-xs text-accent mt-1">
                      <ArrowUp className="w-3 h-3" />
                      <span>12.5% vs last period</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <IndianRupee className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Reports</p>
                    <p className="text-2xl font-bold text-foreground">{totalReports}</p>
                    <div className="flex items-center gap-1 text-xs text-accent mt-1">
                      <ArrowUp className="w-3 h-3" />
                      <span>8.2% vs last period</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Credit Score</p>
                    <p className="text-2xl font-bold text-foreground">{avgScore}</p>
                    <div className="flex items-center gap-1 text-xs text-amber-500 mt-1">
                      <ArrowDown className="w-3 h-3" />
                      <span>2.1% vs last period</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Partners</p>
                    <p className="text-2xl font-bold text-foreground">{mockPartners.filter(p => p.status === 'active').length}</p>
                    <div className="flex items-center gap-1 text-xs text-accent mt-1">
                      <ArrowUp className="w-3 h-3" />
                      <span>3 new this month</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bureau Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bureauData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {bureauData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
