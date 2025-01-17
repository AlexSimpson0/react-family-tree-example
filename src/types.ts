export {};

export type NodeType = 
  | 'person'
  | 'company'
  | 'investment-account'
  | 'real-estate-account'
  | 'private-equity-account'
  | 'retirement-account'
  | 'brokerage-account'
  | 'cash-account';

export interface BaseNode {
  id: string;
  nodeType: NodeType;
  parents: Array<{ id: string; type: string }>;
  children: Array<{ id: string; type: string }>;
  siblings: Array<{ id: string; type: string }>;
  spouses: Array<{ id: string; type: string }>;
}

export interface PersonNode extends BaseNode {
  nodeType: 'person';
  gender: 'male' | 'female';
  netWorth: number;
}

export interface CompanyNode extends BaseNode {
  nodeType: 'company';
  details: {
    trustType?: string;
    established?: string;
    trustee?: string;
    beneficiaries?: string[];
    jurisdiction?: string;
  };
}

export interface AccountNode extends BaseNode {
  balance: number;
  accountNumber: string;
  provider: string;
  details: any; // We'll define specific detail types for each account type
}

export interface InvestmentAccountNode extends AccountNode {
  nodeType: 'investment-account';
  details: {
    portfolioType: string;
    riskProfile: string;
    holdings: Array<{
      name: string;
      value: number;
      allocation: number;
      positions?: Array<{
        symbol?: string;
        name?: string;
        shares?: number;
        value: number;
      }>;
    }>;
    performance: {
      ytd: number;
      '1yr': number;
      '3yr': number;
      '5yr': number;
    };
  };
}

export interface RealEstateAccountNode extends AccountNode {
  nodeType: 'real-estate-account';
  details: {
    properties: Array<{
      address: string;
      type: string;
      value: number;
      rentalIncome: number;
      occupancyRate: number;
      lastValuation: string;
    }>;
    propertyManager: string;
    insuranceProvider: string;
    annualExpenses: number;
  };
}

export interface PrivateEquityAccountNode extends AccountNode {
  nodeType: 'private-equity-account';
  details: {
    fundName: string;
    vintage: number;
    commitment: number;
    drawn: number;
    holdings: Array<{
      company: string;
      ownership: number;
      value: number;
      sector: string;
    }>;
    performance: {
      irr: number;
      tvpi: number;
      dpi: number;
    };
  };
}

export interface RetirementAccountNode extends AccountNode {
  nodeType: 'retirement-account';
  details: {
    accounts: Array<{
      type: string;
      balance: number;
      contributions?: {
        employee?: number;
        employer?: number;
        yearToDate: number;
        lifetime?: number;
      };
      holdings: Array<{
        name: string;
        value: number;
        allocation: number;
      }>;
    }>;
  };
}

export interface BrokerageAccountNode extends AccountNode {
  nodeType: 'brokerage-account';
  details: {
    accountType: string;
    holdings: Array<{
      symbol: string;
      shares: number;
      value: number;
      costBasis: number;
    }>;
    performance: {
      ytd: number;
      '1yr': number;
      '3yr': number;
    };
    taxLotMethod: string;
  };
}

export interface CashAccountNode extends AccountNode {
  nodeType: 'cash-account';
  details: {
    accounts: Array<{
      type: string;
      balance: number;
      accountNumber: string;
      interestRate: number;
      apy?: number;
    }>;
    linkedCards?: Array<{
      type: string;
      lastFour: string;
      rewardsBalance?: number;
      creditLimit?: number;
      dailyLimit?: number;
    }>;
  };
}

export type Node = 
  | PersonNode 
  | CompanyNode 
  | InvestmentAccountNode 
  | RealEstateAccountNode 
  | PrivateEquityAccountNode 
  | RetirementAccountNode 
  | BrokerageAccountNode 
  | CashAccountNode;