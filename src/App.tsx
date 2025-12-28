import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CheckScore from "./pages/CheckScore";
import SelectReports from "./pages/SelectReports";
import PaymentGateway from "./pages/PaymentGateway";
import Dashboard from "./pages/Dashboard";
import CreditReport from "./pages/CreditReport";
import MasterAdminDashboard from "./pages/admin/MasterAdminDashboard";
import PartnerDashboard from "./pages/partner/PartnerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/check-score" element={<CheckScore />} />
          <Route path="/select-reports" element={<SelectReports />} />
          <Route path="/payment" element={<PaymentGateway />} />
          
          {/* User Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/credit-report" element={<CreditReport />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<MasterAdminDashboard />} />
          <Route path="/admin/analytics" element={<MasterAdminDashboard />} />
          <Route path="/admin/reports-repository" element={<MasterAdminDashboard />} />
          <Route path="/admin/users" element={<MasterAdminDashboard />} />
          <Route path="/admin/user-roles" element={<MasterAdminDashboard />} />
          <Route path="/admin/partners" element={<MasterAdminDashboard />} />
          <Route path="/admin/partner-wallets" element={<MasterAdminDashboard />} />
          <Route path="/admin/transactions" element={<MasterAdminDashboard />} />
          <Route path="/admin/score-repair" element={<MasterAdminDashboard />} />
          <Route path="/admin/settings" element={<MasterAdminDashboard />} />
          <Route path="/admin/*" element={<MasterAdminDashboard />} />
          
          {/* Partner Routes */}
          <Route path="/partner/dashboard" element={<PartnerDashboard />} />
          <Route path="/partner/reports" element={<PartnerDashboard />} />
          <Route path="/partner/clients" element={<PartnerDashboard />} />
          <Route path="/partner/wallet" element={<PartnerDashboard />} />
          <Route path="/partner/marketing" element={<PartnerDashboard />} />
          <Route path="/partner/*" element={<PartnerDashboard />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
