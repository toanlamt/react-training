export type Incomes = "salary" | "investment" | "others";
export type Assets = "bond" | "liquidity" | "real_estate" | "others";
export type Liabilities = "personal_loan" | "real_estate_loan" | "others";
export type WealthSources = "inheritance" | "donation";
export type KYCStatus = "pending" | "approved" | "rejected";

export const FinancialTypes = {
  incomes: [
    { key: "salary", label: "Salary" },
    { key: "investment", label: "Investment" },
    { key: "others", label: "Others" },
  ],
  assets: [
    { key: "bond", label: "Bond" },
    { key: "liquidity", label: "Liquidity" },
    { key: "real_estate", label: "Real Estate" },
    { key: "others", label: "Others" },
  ],
  liabilities: [
    { key: "personal_loan", label: "Personal Loan" },
    { key: "real_estate_loan", label: "Real Estate Loan" },
    { key: "others", label: "Others" },
  ],
  wealth_sources: [
    { key: "inheritance", label: "Inheritance" },
    { key: "donation", label: "Donation" },
  ],
};

export interface FinancialItem {
  type: Incomes | Assets | Liabilities | WealthSources;
  amount: number;
}

export const ExperienceOptions = [
  { key: "less_than_5", label: "< 5 years" },
  { key: "between_5_10", label: "> 5 and < 10 years" },
  { key: "more_than_10", label: "> 10 years" },
];

export const RiskOptions = [
  { key: "low", label: "10%" },
  { key: "medium", label: "30%" },
  { key: "high", label: "All-in" },
]

export interface incomeType {
  income_type: Incomes;
  amount: number;
}

export interface assetType {
  asset_type: Assets;
  amount: number;
}

export interface liabilityType {
  liability_type: Liabilities;
  amount: number;
}

export interface sourceType {
  source_type: WealthSources;
  amount: number;
}

export interface KYC {
  first_name: string;
  id: number;
  user_id: number;
  status: KYCStatus;
  status_updated_at: string;
  market_experience: string | null;
  risk_tolerance: string | null;
  incomes: incomeType[] | [];
  assets: assetType[] | [];
  liabilities: liabilityType[] | [];
  wealth_sources: sourceType[] | [];
}

export interface KYCFormData {
  id: string;
  user_id: string;
  market_experience: string | null;
  risk_tolerance: string | null;
  incomes: incomeType[];
  assets: assetType[];
  liabilities: liabilityType[];
  wealth_sources: sourceType[];
}

export interface KYCState {
  kyc: KYC | null;
  isLoading: boolean;
  error: string | null | [];
  pendingKYCList: KYC[];
  resultKYCList: KYC[];
}
