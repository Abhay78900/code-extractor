/**
 * Bureau Data Mapping Utility
 * Maps different bureau field names to CIBIL standard format
 */

// CIBIL Standard Field Names (target format)
export interface StandardizedReportData {
  // Personal Information
  customer_name: string;
  pan_number: string;
  voter_id: string;
  driving_license: string;
  date_of_birth: string;
  gender: string;
  
  // Contact Information
  addresses: AddressRecord[];
  phone_numbers: PhoneRecord[];
  
  // Employment
  occupation_type: string;
  monthly_income: number | null;
  employer_name: string | null;
  
  // Account Information
  accounts: StandardizedAccount[];
  
  // Summary
  total_accounts: number;
  active_accounts: number;
  closed_accounts: number;
  total_overdue: number;
  total_sanctioned: number;
  total_current_balance: number;
}

export interface AddressRecord {
  sequence: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
  date_reported: string;
  address_type: string;
}

export interface PhoneRecord {
  number: string;
  type: 'Mobile' | 'Residence' | 'Office' | 'Other';
  date_reported: string;
}

export interface StandardizedAccount {
  member_name: string;
  account_number: string;
  account_type: string;
  ownership_type: 'Individual' | 'Joint' | 'Guarantor' | 'Authorized User';
  
  // Financial Details
  sanctioned_amount: number;
  current_balance: number;
  amount_overdue: number;
  emi_amount: number | null;
  rate_of_interest: string;
  
  // Dates
  date_opened: string;
  date_closed: string | null;
  date_reported: string;
  
  // Status
  account_status: 'Active' | 'Closed' | 'Written Off' | 'Settled';
  asset_classification: 'STD' | 'SMA' | 'SUB' | 'DBT' | 'LSS';
  
  // Payment History (36 months)
  payment_history: PaymentHistoryRecord[];
}

export interface PaymentHistoryRecord {
  month: string;
  year: number;
  dpd: number;
  asset_classification: string;
}

// Bureau-specific field mappings to CIBIL standard
const bureauFieldMappings: Record<string, Record<string, string>> = {
  experian: {
    // Experian uses different field names
    'overdue_amount': 'amount_overdue',
    'loan_amount': 'sanctioned_amount',
    'outstanding': 'current_balance',
    'date_disbursed': 'date_opened',
    'date_reported_certified': 'date_reported',
    'installment_amount': 'emi_amount',
    'account_holder_type': 'ownership_type',
    'total_amount_due': 'amount_overdue',
  },
  equifax: {
    // Equifax field mappings
    'high_credit': 'sanctioned_amount',
    'balance': 'current_balance',
    'amt_overdue': 'amount_overdue',
    'opened_date': 'date_opened',
    'closed_date': 'date_closed',
    'emi': 'emi_amount',
    'payment_frequency': 'ownership_type',
  },
  crif: {
    // CRIF High Mark field mappings
    'credit_limit': 'sanctioned_amount',
    'outstanding_balance': 'current_balance',
    'total_amount_due': 'amount_overdue',
    'disbursement_date': 'date_opened',
    'closure_date': 'date_closed',
    'monthly_installment': 'emi_amount',
    'account_ownership': 'ownership_type',
  },
};

// Asset Classification mapping
const assetClassificationMap: Record<string, string> = {
  'standard': 'STD',
  'std': 'STD',
  '000': 'STD',
  'regular': 'STD',
  'special_mention': 'SMA',
  'sma': 'SMA',
  'sma-0': 'SMA',
  'sma-1': 'SMA',
  'sma-2': 'SMA',
  'sub_standard': 'SUB',
  'sub': 'SUB',
  'substandard': 'SUB',
  'doubtful': 'DBT',
  'dbt': 'DBT',
  'loss': 'LSS',
  'lss': 'LSS',
  'written_off': 'LSS',
};

// Account type standardization
const accountTypeMap: Record<string, string> = {
  // Loan types
  'home_loan': 'Housing Loan',
  'housing_loan': 'Housing Loan',
  'mortgage': 'Housing Loan',
  'property_loan': 'Property Loan',
  'lap': 'Property Loan',
  'personal_loan': 'Personal Loan',
  'consumer_loan': 'Personal Loan',
  'auto_loan': 'Auto Loan',
  'car_loan': 'Auto Loan',
  'vehicle_loan': 'Auto Loan',
  'two_wheeler_loan': 'Two Wheeler Loan',
  'gold_loan': 'Gold Loan',
  'education_loan': 'Education Loan',
  'business_loan': 'Business Loan',
  'sme_loan': 'Business Loan',
  'commercial_loan': 'Business Loan',
  'credit_card': 'Credit Card',
  'kcc': 'Kisan Credit Card',
  'od': 'Overdraft',
  'overdraft': 'Overdraft',
  'cc': 'Cash Credit',
  'cash_credit': 'Cash Credit',
};

/**
 * Map a value from any bureau format to CIBIL standard
 */
export function mapBureauField(
  bureau: string,
  fieldName: string,
  value: any
): { standardField: string; standardValue: any } {
  const bureauKey = bureau.toLowerCase().replace(/\s+/g, '');
  const mapping = bureauFieldMappings[bureauKey];
  
  if (mapping && mapping[fieldName]) {
    return {
      standardField: mapping[fieldName],
      standardValue: value,
    };
  }
  
  return {
    standardField: fieldName,
    standardValue: value,
  };
}

/**
 * Standardize asset classification across bureaus
 */
export function standardizeAssetClassification(value: string | number): string {
  if (typeof value === 'number') {
    if (value === 0) return 'STD';
    if (value <= 30) return 'SMA';
    if (value <= 90) return 'SUB';
    if (value <= 180) return 'DBT';
    return 'LSS';
  }
  
  const normalized = String(value).toLowerCase().replace(/[^a-z0-9]/g, '');
  return assetClassificationMap[normalized] || 'STD';
}

/**
 * Standardize account type across bureaus
 */
export function standardizeAccountType(value: string): string {
  const normalized = value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z_]/g, '');
  return accountTypeMap[normalized] || value;
}

/**
 * Get DPD color based on days past due
 */
export function getDPDColor(dpd: number): string {
  if (dpd === 0) return 'bg-emerald-500 text-white';
  if (dpd <= 30) return 'bg-amber-500 text-white';
  if (dpd <= 60) return 'bg-orange-500 text-white';
  if (dpd <= 90) return 'bg-red-400 text-white';
  return 'bg-red-600 text-white';
}

/**
 * Get DPD label for display
 */
export function getDPDLabel(dpd: number, status?: string): string {
  if (status) {
    const normalized = standardizeAssetClassification(status);
    if (dpd === 0) return normalized;
    return `${dpd}`;
  }
  if (dpd === 0) return 'STD';
  return `${dpd}`;
}

/**
 * Convert raw bureau response to standardized format
 */
export function standardizeBureauResponse(
  bureauName: string,
  rawData: any
): StandardizedReportData {
  const bureau = bureauName.toLowerCase();
  
  // Default structure
  const result: StandardizedReportData = {
    customer_name: rawData.full_name || rawData.name || rawData.customer_name || 'Not Reported',
    pan_number: rawData.pan_number || rawData.pan || rawData.identification?.pan || 'Not Reported',
    voter_id: rawData.voter_id || rawData.identification?.voter_id || '---',
    driving_license: rawData.driving_license || rawData.identification?.dl || '---',
    date_of_birth: rawData.date_of_birth || rawData.dob || 'Not Reported',
    gender: rawData.gender || 'Not Reported',
    addresses: [],
    phone_numbers: [],
    occupation_type: rawData.occupation || rawData.employment_type || 'Not Reported',
    monthly_income: rawData.income || rawData.monthly_income || null,
    employer_name: rawData.employer || rawData.employer_name || null,
    accounts: [],
    total_accounts: 0,
    active_accounts: 0,
    closed_accounts: 0,
    total_overdue: 0,
    total_sanctioned: 0,
    total_current_balance: 0,
  };
  
  // Process addresses
  if (rawData.address) {
    result.addresses = [{
      sequence: 1,
      address: typeof rawData.address === 'string' ? rawData.address : rawData.address.full || '',
      city: rawData.address.city || '',
      state: rawData.address.state || '',
      pincode: rawData.address.pincode || '',
      date_reported: rawData.address.date_reported || new Date().toISOString(),
      address_type: rawData.address.type || 'Residence',
    }];
  }
  
  // Process phone numbers
  if (rawData.mobile) {
    result.phone_numbers = [{
      number: rawData.mobile,
      type: 'Mobile',
      date_reported: new Date().toISOString(),
    }];
  }
  
  // Process accounts (loans + credit cards)
  const allAccounts = [
    ...(rawData.active_loans || []),
    ...(rawData.closed_loans || []),
    ...(rawData.credit_cards?.map((cc: any) => ({
      ...cc,
      loan_type: 'Credit Card',
      lender: cc.bank,
      sanctioned_amount: cc.credit_limit,
    })) || []),
  ];
  
  result.accounts = allAccounts.map((acc: any) => {
    const standardized: StandardizedAccount = {
      member_name: acc.lender || acc.bank || acc.member_name || 'Unknown',
      account_number: acc.account_number || 'N/A',
      account_type: standardizeAccountType(acc.loan_type || acc.account_type || 'Other'),
      ownership_type: (acc.ownership || acc.ownership_type || 'Individual') as any,
      sanctioned_amount: acc.sanctioned_amount || acc.credit_limit || acc.high_credit || 0,
      current_balance: acc.current_balance || acc.outstanding || acc.balance || 0,
      amount_overdue: acc.overdue_amount || acc.amount_overdue || acc.total_amount_due || 0,
      emi_amount: acc.emi_amount || acc.installment_amount || null,
      rate_of_interest: acc.rate_of_interest || acc.roi || 'Not Reported',
      date_opened: acc.start_date || acc.date_opened || acc.disbursement_date || '',
      date_closed: acc.closed_date || acc.date_closed || acc.closure_date || null,
      date_reported: acc.date_reported || new Date().toISOString(),
      account_status: acc.status === 'Closed' || acc.closed_date ? 'Closed' : 'Active',
      asset_classification: standardizeAssetClassification(acc.asset_classification || 'STD') as any,
      payment_history: (acc.payment_history || []).map((ph: any) => ({
        month: ph.month,
        year: ph.year,
        dpd: ph.dpd || 0,
        asset_classification: standardizeAssetClassification(ph.status || ph.dpd || 0),
      })),
    };
    return standardized;
  });
  
  // Calculate totals
  result.total_accounts = result.accounts.length;
  result.active_accounts = result.accounts.filter(a => a.account_status === 'Active').length;
  result.closed_accounts = result.accounts.filter(a => a.account_status === 'Closed').length;
  result.total_overdue = result.accounts.reduce((sum, a) => sum + a.amount_overdue, 0);
  result.total_sanctioned = result.accounts.reduce((sum, a) => sum + a.sanctioned_amount, 0);
  result.total_current_balance = result.accounts.reduce((sum, a) => sum + a.current_balance, 0);
  
  return result;
}

/**
 * Get bureau-specific score from report
 */
export function getBureauScore(report: any, bureau: string): number {
  const bureauKey = bureau.toLowerCase().replace(/\s+/g, '');
  switch (bureauKey) {
    case 'cibil':
    case 'transunioncibil':
      return report.cibil_score || 0;
    case 'experian':
      return report.experian_score || 0;
    case 'equifax':
      return report.equifax_score || 0;
    case 'crif':
    case 'crifhighmark':
    case 'highmark':
      return report.crif_score || 0;
    default:
      return report.average_score || 0;
  }
}

/**
 * Check if a specific bureau was purchased/selected
 */
export function isBureauPurchased(report: any, bureau: string): boolean {
  const bureauKey = bureau.toLowerCase();
  const score = getBureauScore(report, bureau);
  
  // Check if bureaus_checked array contains this bureau
  if (report.bureaus_checked && Array.isArray(report.bureaus_checked)) {
    return report.bureaus_checked.some((b: string) => 
      b.toLowerCase().includes(bureauKey) || bureauKey.includes(b.toLowerCase().split(' ')[0])
    );
  }
  
  // Fallback to score check
  return score > 0;
}
