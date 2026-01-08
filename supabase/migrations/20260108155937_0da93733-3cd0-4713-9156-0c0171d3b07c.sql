-- Create role enum
CREATE TYPE public.app_role AS ENUM ('user', 'partner_admin', 'master_admin');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  pan_number TEXT,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  referral_code_used TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create partners table
CREATE TABLE public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  franchise_id TEXT NOT NULL UNIQUE,
  phone TEXT,
  address TEXT,
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  wallet_balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  total_wallet_loaded DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  total_sales INTEGER NOT NULL DEFAULT 0,
  total_revenue DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  total_commission_earned DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  total_commission_paid DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Create credit_reports table
CREATE TABLE public.credit_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  pan_number TEXT NOT NULL,
  mobile TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  report_status TEXT NOT NULL DEFAULT 'LOCKED' CHECK (report_status IN ('LOCKED', 'UNLOCKED')),
  initiated_by TEXT NOT NULL DEFAULT 'user' CHECK (initiated_by IN ('user', 'partner')),
  initiator_email TEXT,
  partner_id UUID REFERENCES public.partners(id) ON DELETE SET NULL,
  transaction_id TEXT,
  bureaus_checked TEXT[] NOT NULL DEFAULT '{}',
  cibil_score INTEGER,
  experian_score INTEGER,
  equifax_score INTEGER,
  crif_score INTEGER,
  average_score INTEGER NOT NULL DEFAULT 0,
  score_category TEXT,
  credit_utilization DECIMAL(5,2) DEFAULT 0,
  total_accounts INTEGER DEFAULT 0,
  active_accounts INTEGER DEFAULT 0,
  closed_accounts INTEGER DEFAULT 0,
  hard_enquiries INTEGER DEFAULT 0,
  soft_enquiries INTEGER DEFAULT 0,
  oldest_account_age_months INTEGER DEFAULT 0,
  credit_age_years INTEGER DEFAULT 0,
  is_high_risk BOOLEAN DEFAULT FALSE,
  risk_flags TEXT[],
  improvement_tips TEXT[],
  raw_bureau_data JSONB,
  active_loans JSONB DEFAULT '[]',
  closed_loans JSONB DEFAULT '[]',
  credit_cards JSONB DEFAULT '[]',
  enquiry_details JSONB DEFAULT '[]',
  score_factors JSONB,
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  report_generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.credit_reports ENABLE ROW LEVEL SECURITY;

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL,
  transaction_id TEXT NOT NULL UNIQUE,
  payment_gateway TEXT,
  amount DECIMAL(10,2) NOT NULL,
  bureaus_purchased TEXT[] NOT NULL DEFAULT '{}',
  report_count INTEGER DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  payment_method TEXT,
  initiated_by TEXT NOT NULL DEFAULT 'user' CHECK (initiated_by IN ('user', 'partner')),
  initiator_email TEXT,
  partner_id UUID REFERENCES public.partners(id) ON DELETE SET NULL,
  commission_amount DECIMAL(10,2),
  referral_code TEXT,
  client_name TEXT,
  client_pan TEXT,
  client_mobile TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create wallet_transactions table
CREATE TABLE public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES public.partners(id) ON DELETE CASCADE NOT NULL,
  partner_email TEXT NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('credit', 'debit')),
  amount DECIMAL(10,2) NOT NULL,
  balance_before DECIMAL(12,2) NOT NULL,
  balance_after DECIMAL(12,2) NOT NULL,
  description TEXT NOT NULL,
  reference_id TEXT,
  status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'pending', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Create score_repair_requests table
CREATE TABLE public.score_repair_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_mobile TEXT NOT NULL,
  current_score INTEGER NOT NULL,
  target_score INTEGER,
  report_id UUID REFERENCES public.credit_reports(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'in_progress', 'completed', 'cancelled')),
  service_charge DECIMAL(10,2),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.score_repair_requests ENABLE ROW LEVEL SECURITY;

-- Create app_settings table
CREATE TABLE public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- user_roles policies
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'master_admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'master_admin'));

-- profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'master_admin'));

-- partners policies
CREATE POLICY "Partners can view their own data"
ON public.partners FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Partners can update their own data"
ON public.partners FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all partners"
ON public.partners FOR SELECT
USING (public.has_role(auth.uid(), 'master_admin'));

CREATE POLICY "Admins can manage all partners"
ON public.partners FOR ALL
USING (public.has_role(auth.uid(), 'master_admin'));

-- credit_reports policies
CREATE POLICY "Users can view their own reports"
ON public.credit_reports FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Partners can view reports they created"
ON public.credit_reports FOR SELECT
USING (
  public.has_role(auth.uid(), 'partner_admin') AND
  partner_id IN (SELECT id FROM public.partners WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can view all reports"
ON public.credit_reports FOR SELECT
USING (public.has_role(auth.uid(), 'master_admin'));

CREATE POLICY "Admins can manage all reports"
ON public.credit_reports FOR ALL
USING (public.has_role(auth.uid(), 'master_admin'));

CREATE POLICY "Partners can create reports"
ON public.credit_reports FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'partner_admin') AND
  partner_id IN (SELECT id FROM public.partners WHERE user_id = auth.uid())
);

-- transactions policies
CREATE POLICY "Users can view their own transactions"
ON public.transactions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Partners can view their transactions"
ON public.transactions FOR SELECT
USING (
  public.has_role(auth.uid(), 'partner_admin') AND
  partner_id IN (SELECT id FROM public.partners WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can view all transactions"
ON public.transactions FOR SELECT
USING (public.has_role(auth.uid(), 'master_admin'));

-- wallet_transactions policies
CREATE POLICY "Partners can view their wallet transactions"
ON public.wallet_transactions FOR SELECT
USING (
  partner_id IN (SELECT id FROM public.partners WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can view all wallet transactions"
ON public.wallet_transactions FOR SELECT
USING (public.has_role(auth.uid(), 'master_admin'));

CREATE POLICY "Admins can manage wallet transactions"
ON public.wallet_transactions FOR ALL
USING (public.has_role(auth.uid(), 'master_admin'));

-- score_repair_requests policies
CREATE POLICY "Users can view their own repair requests"
ON public.score_repair_requests FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create repair requests"
ON public.score_repair_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all repair requests"
ON public.score_repair_requests FOR SELECT
USING (public.has_role(auth.uid(), 'master_admin'));

CREATE POLICY "Admins can manage repair requests"
ON public.score_repair_requests FOR ALL
USING (public.has_role(auth.uid(), 'master_admin'));

-- app_settings policies
CREATE POLICY "Anyone can view app settings"
ON public.app_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can manage app settings"
ON public.app_settings FOR ALL
USING (public.has_role(auth.uid(), 'master_admin'));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partners_updated_at
BEFORE UPDATE ON public.partners
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_credit_reports_updated_at
BEFORE UPDATE ON public.credit_reports
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_score_repair_requests_updated_at
BEFORE UPDATE ON public.score_repair_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_app_settings_updated_at
BEFORE UPDATE ON public.app_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default app settings
INSERT INTO public.app_settings (setting_key, setting_value) VALUES
  ('cibil_price', '99'),
  ('experian_price', '99'),
  ('equifax_price', '99'),
  ('crif_price', '99'),
  ('partner_commission_rate', '10'),
  ('score_repair_base_price', '2999');