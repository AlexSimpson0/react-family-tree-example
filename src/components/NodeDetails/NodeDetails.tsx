import React, { memo, useCallback } from 'react';
import classNames from 'classnames';
import type { Node } from 'relatives-tree/lib/types';
import { Relations } from './Relations';
import css from './NodeDetails.module.css';

interface ExtendedNode extends Node {
  nodeType?: 'person' | 'company' | 'account';
  netWorth?: number;
  dateOfBirth?: string;
  relationshipStatus?: string;
  advisorAUM?: number;
  balance?: number;
  homeValue?: number;
  cashValue?: number;
  principalBalance?: number;
  originalLoanAmount?: number;
  accountNumber?: string;
  providerName?: string;
  providerCategoryId?: number;
  accountType?: string;
  details?: {
    ownershipPercentage?: number;
    cash?: number;
    holdings?: Array<{
      description: string;
      holdingType: string;
      value: number;
      quantity: number;
      price: number;
      symbol?: string;
      isin?: string;
      allocation: number;
    }>;
    fullAddress?: string;
    type?: string;
    purchasePrice?: number;
    equity?: number;
    ltv?: number;
    occupancyRate?: number;
    estimatedDate?: string;
    annualExpenses?: number;
    annualRentalIncome?: number;
    mortgageDetails?: {
      principalBalance: number;
      originalLoanAmount: number;
      value: number;
      purchasePrice: number;
    };
    displayedName?: string;
    businessName?: string;
    SEISInvestmentAmount?: number;
    EISInvestmentAmount?: number;
    quantity?: number;
    businessSector?: string;
    interestRate?: number;
    faceAmount?: number;
  };
}

interface NodeDetailsProps {
  node: Readonly<ExtendedNode>;
  className?: string;
  onSelect: (nodeId: string | undefined) => void;
  onHover: (nodeId: string) => void;
  onClear: () => void;
}

const formatCurrency = (amount?: { currency: string; amount: number } | number) => {
  if (!amount) return '-';
  
  // Handle MonetaryAmount object
  if (typeof amount === 'object') {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: amount.currency || 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount.amount);
  }
  
  // Fallback for legacy number values
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

const formatPercent = (value?: number) => {
  if (!value) return '0%';
  return `${value.toFixed(1)}%`;
};

const formatDate = (date: string | undefined) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const NodeDetails = memo(
  function NodeDetails({ node, className, ...props }: NodeDetailsProps) {
    const closeHandler = useCallback(() => props.onSelect(undefined), [props]);

    const renderBasicInfo = () => {
      if (node.nodeType === 'person') {
        return (
          <div className={css.section}>
            <h4 className={css.sectionTitle}>Personal Information</h4>
            <div className={css.sectionContent}>
              <div className={css.field}>
                <span className={css.label}>Net Worth:</span>
                <span className={css.value}>{formatCurrency(node.netWorth)}</span>
              </div>
              <div className={css.field}>
                <span className={css.label}>Date of Birth:</span>
                <span className={css.value}>{formatDate(node.dateOfBirth)}</span>
              </div>
              <div className={css.field}>
                <span className={css.label}>Relationship Status:</span>
                <span className={css.value}>{node.relationshipStatus}</span>
              </div>
              <div className={css.field}>
                <span className={css.label}>Advisor AUM:</span>
                <span className={css.value}>{formatCurrency(node.advisorAUM)}</span>
              </div>
            </div>
          </div>
        );
      }
    
      else if (node.nodeType === 'account' || node.balance) {
        return (
          <div className={css.section}>
            <h4 className={css.sectionTitle}>Account Information</h4>
            <div className={css.sectionContent}>
              {node.balance !== undefined && (
                <div className={css.field}>
                  <span className={css.label}>Balance:</span>
                  <span className={css.value}>{formatCurrency(node.balance)}</span>
                </div>
              )}
              {node.accountNumber && (
                <div className={css.field}>
                  <span className={css.label}>Account Number:</span>
                  <span className={css.value}>****{node.accountNumber.slice(-4)}</span>
                </div>
              )}
              {node.providerName && (
                <div className={css.field}>
                  <span className={css.label}>Provider:</span>
                  <span className={css.value}>{node.providerName}</span>
                </div>
              )}
              {node.accountType && (
                <div className={css.field}>
                  <span className={css.label}>Account Type:</span>
                  <span className={css.value}>{node.accountType}</span>
                </div>
              )}
              {node.details?.ownershipPercentage && (
                <div className={css.field}>
                  <span className={css.label}>Ownership:</span>
                  <span className={css.value}>{formatPercent(node.details.ownershipPercentage)}</span>
                </div>
              )}
            </div>
          </div>
        );
      }
    
      return null;
    };

    const renderInvestmentDetails = () => {
      const { details } = node;
      if (!details?.holdings) return null;

      return (
        <div className={css.section}>
          <h4 className={css.sectionTitle}>Investment Details</h4>
          <div className={css.sectionContent}>
            {details.cash !== undefined && (
              <div className={css.field}>
                <span className={css.label}>Cash Balance:</span>
                <span className={css.value}>{formatCurrency(details.cash)}</span>
              </div>
            )}
            
            <h5 className={css.subsectionTitle}>Holdings</h5>
            <div className={css.holdingsList}>
              {details.holdings.map((holding, index) => (
                <div key={index} className={css.holding}>
                  <div className={css.holdingHeader}>
                    <span>{holding.description}</span>
                    <span>{formatCurrency(holding.value)} ({formatPercent(holding.allocation)})</span>
                  </div>
                  <div className={css.holdingDetails}>
                    <div className={css.field}>
                      <span className={css.label}>Quantity:</span>
                      <span className={css.value}>{holding.quantity.toLocaleString()}</span>
                    </div>
                    <div className={css.field}>
                      <span className={css.label}>Price:</span>
                      <span className={css.value}>{formatCurrency(holding.price)}</span>
                    </div>
                    {holding.isin && (
                      <div className={css.field}>
                        <span className={css.label}>ISIN:</span>
                        <span className={css.value}>{holding.isin}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };

    const renderPropertyDetails = () => {
      const { details } = node;
      if (!details) return null;

      return (
        <div className={css.section}>
          <h4 className={css.sectionTitle}>Property Details</h4>
          <div className={css.sectionContent}>
            <div className={css.field}>
              <span className={css.label}>Address:</span>
              <span className={css.value}>{details.fullAddress}</span>
            </div>
            <div className={css.field}>
              <span className={css.label}>Type:</span>
              <span className={css.value}>{details.type}</span>
            </div>
            <div className={css.field}>
              <span className={css.label}>Value:</span>
              <span className={css.value}>{formatCurrency(node.homeValue)}</span>
            </div>
            <div className={css.field}>
              <span className={css.label}>Purchase Price:</span>
              <span className={css.value}>{formatCurrency(details.purchasePrice)}</span>
            </div>
            <div className={css.field}>
              <span className={css.label}>Equity:</span>
              <span className={css.value}>{formatCurrency(details.equity)}</span>
            </div>
            <div className={css.field}>
              <span className={css.label}>LTV:</span>
              <span className={css.value}>{formatPercent(details.ltv)}</span>
            </div>
            {details.occupancyRate !== undefined && (
              <div className={css.field}>
                <span className={css.label}>Occupancy Rate:</span>
                <span className={css.value}>{formatPercent(details.occupancyRate)}</span>
              </div>
            )}
            {details.annualRentalIncome && (
              <div className={css.field}>
                <span className={css.label}>Annual Rental Income:</span>
                <span className={css.value}>{formatCurrency(details.annualRentalIncome)}</span>
              </div>
            )}
            <div className={css.field}>
              <span className={css.label}>Annual Expenses:</span>
              <span className={css.value}>{formatCurrency(details.annualExpenses)}</span>
            </div>
            {details.mortgageDetails && (
              <div className={css.subsection}>
                <h5 className={css.subsectionTitle}>Mortgage Details</h5>
                <div className={css.field}>
                  <span className={css.label}>Principal Balance:</span>
                  <span className={css.value}>{formatCurrency(details.mortgageDetails.principalBalance)}</span>
                </div>
                <div className={css.field}>
                  <span className={css.label}>Original Loan:</span>
                  <span className={css.value}>{formatCurrency(details.mortgageDetails.originalLoanAmount)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    };

    const renderPrivateInvestmentDetails = () => {
      const { details } = node;
      if (!details) return null;

      return (
        <div className={css.section}>
          <h4 className={css.sectionTitle}>Private Investment Details</h4>
          <div className={css.sectionContent}>
            <div className={css.field}>
              <span className={css.label}>Fund Name:</span>
              <span className={css.value}>{details.displayedName}</span>
            </div>
            <div className={css.field}>
              <span className={css.label}>Manager:</span>
              <span className={css.value}>{details.businessName}</span>
            </div>
            {details.SEISInvestmentAmount && (
              <div className={css.field}>
                <span className={css.label}>SEIS Investment:</span>
                <span className={css.value}>{formatCurrency(details.SEISInvestmentAmount)}</span>
              </div>
            )}
            {details.EISInvestmentAmount && (
              <div className={css.field}>
                <span className={css.label}>EIS Investment:</span>
                <span className={css.value}>{formatCurrency(details.EISInvestmentAmount)}</span>
              </div>
            )}
            <div className={css.field}>
              <span className={css.label}>Sector:</span>
              <span className={css.value}>{details.businessSector}</span>
            </div>
            <div className={css.field}>
              <span className={css.label}>Quantity:</span>
              <span className={css.value}>{details.quantity}</span>
            </div>
          </div>
        </div>
      );
    };

    const renderBankDetails = () => {
      const { details } = node;
      if (!details) return null;

      return (
        <div className={css.section}>
          <h4 className={css.sectionTitle}>Bank Account Details</h4>
          <div className={css.sectionContent}>
            {details.interestRate !== undefined && (
              <div className={css.field}>
                <span className={css.label}>Interest Rate:</span>
                <span className={css.value}>{formatPercent(details.interestRate)}</span>
              </div>
            )}
          </div>
        </div>
      );
    };

    const renderCreditDetails = () => {
      const { details } = node;
      if (!details) return null;

      return (
        <div className={css.section}>
          <h4 className={css.sectionTitle}>Credit Account Details</h4>
          <div className={css.sectionContent}>
            <div className={css.field}>
              <span className={css.label}>Credit Limit:</span>
              <span className={css.value}>{formatCurrency(node.balance)}</span>
            </div>
            <div className={css.field}>
              <span className={css.label}>Interest Rate:</span>
              <span className={css.value}>{formatPercent(details.interestRate)}</span>
            </div>
          </div>
        </div>
      );
    };

    const renderLoanDetails = () => {
      const { details } = node;
      if (!details) return null;

      return (
        <div className={css.section}>
          <h4 className={css.sectionTitle}>Loan Details</h4>
          <div className={css.sectionContent}>
            <div className={css.field}>
              <span className={css.label}>Principal Balance:</span>
              <span className={css.value}>{formatCurrency(node.principalBalance)}</span>
            </div>
            <div className={css.field}>
              <span className={css.label}>Original Amount:</span>
              <span className={css.value}>{formatCurrency(details.mortgageDetails?.originalLoanAmount)}</span>
            </div>
            <div className={css.field}>
              <span className={css.label}>Interest Rate:</span>
              <span className={css.value}>{formatPercent(details.interestRate)}</span>
            </div>
          </div>
        </div>
      );
    };

    const renderInsuranceDetails = () => {
      const { details } = node;
      if (!details) return null;

      return (
        <div className={css.section}>
          <h4 className={css.sectionTitle}>Insurance Details</h4>
          <div className={css.sectionContent}>
            <div className={css.field}>
              <span className={css.label}>Cash Value:</span>
              <span className={css.value}>{formatCurrency(node.cashValue)}</span>
            </div>
            <div className={css.field}>
              <span className={css.label}>Face Amount:</span>
              <span className={css.value}>{formatCurrency(details.faceAmount)}</span>
            </div>
          </div>
        </div>
      );
    };

    const renderCryptoDetails = () => {
      const { details } = node;
      if (!details?.holdings) return null;
    
      return (
        <div className={css.section}>
          <h4 className={css.sectionTitle}>Crypto Details</h4>
          <div className={css.sectionContent}>
            {details.cash !== undefined && (
              <div className={css.field}>
                <span className={css.label}>Cash Balance:</span>
                <span className={css.value}>{formatCurrency(details.cash)}</span>
              </div>
            )}
            
            <h5 className={css.subsectionTitle}>Holdings</h5>
            <div className={css.holdingsList}>
              {details.holdings.map((holding, index) => (
                <div key={index} className={css.holding}>
                  <div className={css.holdingHeader}>
                    <span>{holding.description}</span>
                    <span>{formatCurrency(holding.value)} ({formatPercent(holding.allocation)})</span>
                  </div>
                  <div className={css.holdingDetails}>
                    <div className={css.field}>
                      <span className={css.label}>Quantity:</span>
                      <span className={css.value}>{holding.quantity.toLocaleString()}</span>
                    </div>
                    <div className={css.field}>
                      <span className={css.label}>Price:</span>
                      <span className={css.value}>{formatCurrency(holding.price)}</span>
                    </div>
                    {holding.symbol && (
                      <div className={css.field}>
                        <span className={css.label}>Symbol:</span>
                        <span className={css.value}>{holding.symbol}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };
    
    const renderNFTDetails = () => {
      const { details } = node;
      if (!details?.holdings) return null;
    
      return (
        <div className={css.section}>
          <h4 className={css.sectionTitle}>NFT Collection</h4>
          <div className={css.sectionContent}>
            {details.cash !== undefined && (
              <div className={css.field}>
                <span className={css.label}>Floor Value:</span>
                <span className={css.value}>{formatCurrency(details.cash)}</span>
              </div>
            )}
            
            <h5 className={css.subsectionTitle}>Holdings</h5>
            <div className={css.holdingsList}>
              {details.holdings.map((holding, index) => (
                <div key={index} className={css.holding}>
                  <div className={css.holdingHeader}>
                    <span>{holding.description}</span>
                    <span>{formatCurrency(holding.value)}</span>
                  </div>
                  <div className={css.holdingDetails}>
                    <div className={css.field}>
                      <span className={css.label}>Token ID:</span>
                      <span className={css.value}>{holding.quantity}</span>
                    </div>
                    {holding.symbol && (
                      <div className={css.field}>
                        <span className={css.label}>Collection:</span>
                        <span className={css.value}>{holding.symbol}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };
    
    const renderOtherAssetDetails = () => {
      const { details } = node;
      if (!details) return null;
    
      return (
        <div className={css.section}>
          <h4 className={css.sectionTitle}>Asset Details</h4>
          <div className={css.sectionContent}>
            {details.interestRate !== undefined && (
              <div className={css.field}>
                <span className={css.label}>Value:</span>
                <span className={css.value}>{formatCurrency(node.balance)}</span>
              </div>
            )}
          </div>
        </div>
      );
    };
    
    const renderOtherLiabilityDetails = () => {
      const { details } = node;
      if (!details) return null;
    
      return (
        <div className={css.section}>
          <h4 className={css.sectionTitle}>Liability Details</h4>
          <div className={css.sectionContent}>
            <div className={css.field}>
              <span className={css.label}>Principal Balance:</span>
              <span className={css.value}>{formatCurrency(node.balance)}</span>
            </div>
            <div className={css.field}>
              <span className={css.label}>Original Amount:</span>
              <span className={css.value}>{formatCurrency(node.originalLoanAmount)}</span>
            </div>
            <div className={css.field}>
              <span className={css.label}>Interest Rate:</span>
              <span className={css.value}>{formatPercent(details.interestRate)}</span>
            </div>
          </div>
        </div>
      );
    };

    const renderSpecificDetails = () => {
      if (!node.providerCategoryId) return null;
  
      switch (node.providerCategoryId) {
        case 1: // Banking
          return renderBankDetails();
        
        case 2: // Investments
          return renderInvestmentDetails();
        
        case 3: // Insurance
          return renderInsuranceDetails();
        
        case 4: // Property
          return renderPropertyDetails();
        
        case 5: // Credit
          return renderCreditDetails();
        
        case 6: // Loans
          return renderLoanDetails();
        
        case 7: // Crypto
          return renderCryptoDetails();
        
        case 8: // NFTs
          return renderNFTDetails();
        
        case 10: // Other Assets
          return renderOtherAssetDetails();
        
        case 11: // Other Liabilities
          return renderOtherLiabilityDetails();
        
        case 12: // Private Investments
          return renderPrivateInvestmentDetails();
        
        default:
          return null;
      }
    };

    return (
      <section className={classNames(css.root, className)}>
        <header className={css.header}>
          <h3 className={css.title}>{node.id}</h3>
          <button className={css.close} onClick={closeHandler}>×</button>
        </header>
        
        {renderBasicInfo()}
        {renderSpecificDetails()}
        
        {node.nodeType === 'person' && (
          <>
            <Relations {...props} title="Parents" items={node.parents} />
            <Relations {...props} title="Ownership Structures" items={node.children} />
            <Relations {...props} title="Siblings" items={node.siblings} />
            <Relations {...props} title="Spouses" items={node.spouses} />
          </>
        )}
        
        {node.nodeType === 'company' && (
          <>
            <Relations {...props} title="Owner" items={node.parents} />
          </>
        )}
      </section>
    );
  },
);