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
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast.error(error.message || 'Invalid email or password');
      setIsLoading(false);
      return;
    }

    toast.success('Welcome back!');
    navigate('/dashboard');
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!fullName.trim()) {
      toast.error('Please enter your full name');
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(email, password, fullName);

    if (error) {
      toast.error(error.message || 'Failed to create account');
      setIsLoading(false);
      return;
    }

    toast.success('Account created successfully!');
    navigate('/dashboard');
    setIsLoading(false);
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
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                {activeTab === 'login' ? (
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

                    <Button type="submit" className="w-full" size="lg" disabled={isLoading || authLoading}>
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Enter your full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signupEmail">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signupEmail"
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
                      <Label htmlFor="signupPassword">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signupPassword"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a password (min 6 characters)"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10"
                          minLength={6}
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

                    <Button type="submit" className="w-full" size="lg" disabled={isLoading || authLoading}>
                      {isLoading ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </form>
                )}

                <p className="text-sm text-center text-muted-foreground mt-6">
                  {activeTab === 'login' ? (
                    <>
                      Don't have an account?{' '}
                      <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab('signup')}>
                        Sign up
                      </Button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab('login')}>
                        Sign in
                      </Button>
                    </>
                  )}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
