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
import UnlockReport from "./pages/UnlockReport";
import AuthRedirect from "./pages/AuthRedirect";
import MasterAdminDashboard from "./pages/admin/MasterAdminDashboard";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminUsers from "./pages/admin/AdminUsers";
import ManagePartners from "./pages/admin/ManagePartners";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import PartnerDashboard from "./pages/partner/PartnerDashboard";
import PartnerClients from "./pages/partner/PartnerClients";
import PartnerReports from "./pages/partner/PartnerReports";
import PartnerWalletManagement from "./pages/partner/PartnerWalletManagement";
import PartnerMarketing from "./pages/partner/PartnerMarketing";
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
          <Route path="/auth-redirect" element={<AuthRedirect />} />
          
          {/* User Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/credit-report" element={<CreditReport />} />
          <Route path="/unlock-report" element={<UnlockReport />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<MasterAdminDashboard />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/reports-repository" element={<AdminReports />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/user-roles" element={<AdminUsers />} />
          <Route path="/admin/partners" element={<ManagePartners />} />
          <Route path="/admin/partner-wallets" element={<ManagePartners />} />
          <Route path="/admin/transactions" element={<MasterAdminDashboard />} />
          <Route path="/admin/score-repair" element={<MasterAdminDashboard />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/*" element={<MasterAdminDashboard />} />
          
          {/* Partner Routes */}
          <Route path="/partner/dashboard" element={<PartnerDashboard />} />
          <Route path="/partner/reports" element={<PartnerReports />} />
          <Route path="/partner/clients" element={<PartnerClients />} />
          <Route path="/partner/wallet" element={<PartnerWalletManagement />} />
          <Route path="/partner/marketing" element={<PartnerMarketing />} />
          <Route path="/partner/*" element={<PartnerDashboard />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
