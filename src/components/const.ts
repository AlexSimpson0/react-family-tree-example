import familyStructure from './Data/familyStructure.json';
import rawWealthData from './Data/wealthData.json';
import type { Node, Gender, RelType } from 'relatives-tree/lib/types';

export const NODE_WIDTH = 280;
export const NODE_HEIGHT = 102;

export const NODE_TYPES = {
  ACCOUNT: 'ACCOUNT',
  COMPANY: 'COMPANY',
  PERSON: 'PERSON',
  TRUST: 'TRUST'
} as const;

interface MonetaryAmount {
  currency: string;
  amount: number;
}

interface Relationship {
  id: string;
  type: string;
}

interface WealthNode {
  id: string;
  nodeType: string;
  advisorAUM: MonetaryAmount;
  dateOfBirth?: string | null;
  gender?: string | null;
  netWorth: MonetaryAmount;
  relationshipStatus?: string | null;
  accountNumber?: string | null;
  accountType?: string | null;
  balance: MonetaryAmount;
  providerName?: string | null;
  providerCategoryId?: number | null;
  details?: {
    ownershipPercentage: number;
    // Address fields
    addressType?: string;
    address1?: string | null;
    address2?: string | null;
    address3?: string | null;
    city?: string | null;
    region?: string | null;
    postCode?: string | null;
    country?: string | null;
    fullAddress?: string | null;
    sourceType?: string | null;
    coordinates?: {
      latitude: number | null;
      longitude: number | null;
    };
    // Add all the account-specific fields here
    accountId?: number;
    accountName?: string;
    amountDue?: MonetaryAmount;
    interestPaidYTD?: MonetaryAmount;
    premium?: MonetaryAmount;
    deathBenefit?: MonetaryAmount;
    policyTerm?: string;
    apr?: number;
    isAsset?: boolean;
    isIsa?: boolean;
    availableCash?: MonetaryAmount;
    availableCredit?: MonetaryAmount;
    cash?: MonetaryAmount;
    cashValue?: MonetaryAmount;
    classification?: string;
    userClassification?: string;
    container?: string;
    expirationDate?: string;
    faceAmount?: MonetaryAmount;
    interestRate?: number;
    lastUpdated?: string;
    isManual?: boolean;
    displayedName?: string;
    nickName?: string;
    accountStatus?: string;
    originalLoanAmount?: MonetaryAmount;
    principalBalance?: MonetaryAmount;
    term?: string;
    valuationType?: string;
    homeValue?: MonetaryAmount;
    estimatedDate?: string;
    includeInNetWorth?: boolean;
    equity?: MonetaryAmount;
    manualMortgage?: MonetaryAmount;
    purchasePrice?: MonetaryAmount;
    propertyType?: string;
    isAdvisorManaged?: boolean;
    isPrivate?: boolean;
    businessName?: string;
    businessSector?: string;
    businessValue?: MonetaryAmount;
    expectedMaturityDate?: string;
    expectedIrrPercent?: number;
    expectedMultiplier?: number;
    irr?: number;
    ownershipStartDate?: string;
    initialInvestment?: MonetaryAmount;
    initialInvestmentDate?: string;
    totalCommittedCapital?: MonetaryAmount;
    currentValueDate?: string;
    seisAmount?: MonetaryAmount;
    seisInvestmentDate?: string;
    eisAmount?: MonetaryAmount;
    eisInvestmentDate?: string;
    floorArea?: {
      area: number;
      unit: number;
    };
    bedrooms?: number;
    bathrooms?: number;
    propertyTax?: MonetaryAmount;
    insuranceCost?: MonetaryAmount;
    maintenanceCost?: MonetaryAmount;
    managementFees?: number;
    serviceCharges?: MonetaryAmount;
    groundRent?: MonetaryAmount;
    rentalType?: number;
    tenantCount?: number;
    tenancyStartDate?: string;
    tenancyLengthMonths?: number;
    averageNightlyRate?: MonetaryAmount;
    commercialPropertyType?: number;
    annualOccupancyRate?: number;
    monthlyRentalIncome?: MonetaryAmount;
  } | null;
  parents: Relationship[];
  children: Relationship[];
  siblings: Relationship[];
  spouses: Relationship[];
}

interface ExtendedNode extends Node {
  nodeType?: string;
  balance?: MonetaryAmount;
  accountType?: string;
  providerName?: string;
  advisorAUM?: MonetaryAmount;
  netWorth?: MonetaryAmount;
  dateOfBirth?: string;
  relationshipStatus?: string;
  accountNumber?: string;
  providerCategoryId?: number;
  details?: {
    ownershipPercentage: number;
  };
}

// First cast to unknown, then to WealthNode[]
const typedWealthData = (rawWealthData as unknown) as WealthNode[];

const wealthData = typedWealthData.map(node => {
  const transformedNode: ExtendedNode = {
    id: node.id,
    gender: node.gender as Gender || (node.nodeType === NODE_TYPES.PERSON ? 'male' as Gender : 'neutral' as Gender),
    nodeType: (() => {
      switch (node.nodeType) {
        case NODE_TYPES.ACCOUNT:
          return 'account';
        case NODE_TYPES.COMPANY:
          return 'company';
        case NODE_TYPES.PERSON:
          return 'person';
        case NODE_TYPES.TRUST:
          return 'trust';
        default:
          return 'account';
      }
    })(),
    parents: node.parents.map(p => ({
      id: p.id,
      type: p.type as RelType
    })),
    children: node.children.map(c => ({
      id: c.id,
      type: c.type as RelType
    })),
    siblings: node.siblings.map(s => ({
      id: s.id,
      type: s.type as RelType
    })),
    spouses: node.spouses.map(s => ({
      id: s.id,
      type: s.type as RelType
    })),
    balance: node.balance,
    accountType: node.accountType || undefined,
    providerName: node.providerName || undefined,
    advisorAUM: node.advisorAUM,
    netWorth: node.netWorth,
    dateOfBirth: node.dateOfBirth || undefined,
    relationshipStatus: node.relationshipStatus || undefined,
    accountNumber: node.accountNumber || undefined,
    providerCategoryId: node.providerCategoryId || undefined,
    details: node.details || undefined
  };

  return transformedNode;
});

export const SOURCES = {
  'Family Structure': familyStructure,
  'Wealth Structure': wealthData,
} as Readonly<{ [key: string]: readonly Readonly<Node>[] }>;

export const DEFAULT_SOURCE = Object.keys(SOURCES)[0];
export const URL_LABEL = 'URL (Gist, Paste.bin, ...)';