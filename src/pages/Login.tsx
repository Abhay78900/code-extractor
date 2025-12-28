import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  Mail, 
  Lock, 
  ArrowLeft, 
  Eye, 
  EyeOff,
  User,
  Building2,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { setCurrentUserRole } from '@/data/mockData';

const demoCredentials = [
  { role: 'USER', email: 'john.doe@example.com', password: 'demo123', label: 'User', icon: User },
  { role: 'PARTNER_ADMIN', email: 'partner@example.com', password: 'demo123', label: 'Partner', icon: Building2 },
  { role: 'MASTER_ADMIN', email: 'admin@creditcheck.com', password: 'demo123', label: 'Admin', icon: Shield },
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Demo login logic
    const matchedUser = demoCredentials.find(
      cred => cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
    );

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (matchedUser) {
      setCurrentUserRole(matchedUser.role as any);
      toast.success(`Welcome back! Logged in as ${matchedUser.label}`);
      
      if (matchedUser.role === 'MASTER_ADMIN') {
        navigate('/admin/dashboard');
      } else if (matchedUser.role === 'PARTNER_ADMIN') {
        navigate('/partner/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      toast.error('Invalid email or password. Try one of the demo credentials below.');
    }

    setIsLoading(false);
  };

  const handleDemoLogin = (cred: typeof demoCredentials[0]) => {
    setEmail(cred.email);
    setPassword(cred.password);
    toast.info(`Demo credentials filled. Click Login to proceed.`);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <CreditCard className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-display font-bold text-primary-foreground">CreditCheck</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-display font-bold text-primary-foreground mb-6">
            Welcome Back
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-md">
            Access your credit reports, track your score, and manage your financial health - all in one place.
          </p>
        </motion.div>

        <div className="flex gap-8">
          <div>
            <p className="text-3xl font-bold text-primary-foreground">1Cr+</p>
            <p className="text-primary-foreground/70">Users</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary-foreground">4</p>
            <p className="text-primary-foreground/70">Bureaus</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary-foreground">99.9%</p>
            <p className="text-primary-foreground/70">Accuracy</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-8 gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-foreground">CreditCheck</span>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-display">Sign In</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-8">
                  <p className="text-sm text-center text-muted-foreground mb-4">
                    Try demo credentials
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {demoCredentials.map((cred) => {
                      const Icon = cred.icon;
                      return (
                        <Button
                          key={cred.role}
                          variant="outline"
                          size="sm"
                          onClick={() => handleDemoLogin(cred)}
                          className="flex-col h-auto py-3 gap-1"
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-xs">{cred.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <p className="text-sm text-center text-muted-foreground mt-6">
                  Don't have an account?{' '}
                  <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/check-score')}>
                    Check your credit score
                  </Button>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
