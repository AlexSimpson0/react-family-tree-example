import React, { useCallback } from 'react';
import type { ExtNode } from 'relatives-tree/lib/types';
import css from './FamilyNode.module.css';

interface MonetaryAmount {
  currency: string;
  amount: number;
}

interface ExtendedNode extends ExtNode {
  netWorth?: MonetaryAmount;
  balance?: MonetaryAmount;
  homeValue?: MonetaryAmount;
  cashValue?: MonetaryAmount;
  principalBalance?: MonetaryAmount;
  accountNumber?: string;
  providerName?: string;
  accountType?: string;
  nodeType?: 'person' | 'company' | 'account'| 'trust';
  details?: {
    accountType?: string;
    ownershipPercentage?: number;
    cash?: number;
    holdings?: any[];
    fullAddress?: string;
    type?: string;
    purchasePrice?: number;
    equity?: number;
    ltv?: number;
  };
}

interface FamilyNodeProps {
  node: ExtendedNode;
  isRoot: boolean;
  isHover?: boolean;
  onClick: (id: string) => void;
  onSubClick: (id: string) => void;
  style?: React.CSSProperties;
}

export const FamilyNode = React.memo(
  function FamilyNode({ node, isRoot, isHover, onClick, style }: FamilyNodeProps) {
    const clickHandler = useCallback(() => onClick(node.id), [node.id, onClick]);

    // Format currency with no decimal places
    const formatCurrency = (amount?: MonetaryAmount | number) => {
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
      
      // Handle plain number (legacy support)
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(amount);
    };

    const getNodeValue = (node: ExtendedNode) => {
      if (node.balance) {
        return node.balance;
      }
      if (node.netWorth) {
        return node.netWorth;
      }
      return { currency: 'GBP', amount: 0 };
    };

    const getAccountTypeClass = (node: ExtendedNode): string => {
      if (!node.details?.accountType) return '';
      
      const type = node.details.accountType.toLowerCase();
      if (type.includes('isa') || type.includes('sipp') || type.includes('gia')) return css.investment;
      if (type.includes('property') || type.includes('rental')) return css.property;
      if (type.includes('crypto')) return css.crypto;
      if (type.includes('savings') || type.includes('checking')) return css.bank;
      if (type.includes('credit')) return css.credit;
      if (type.includes('mortgage') || type.includes('loan')) return css.loan;
      if (type.includes('insurance')) return css.insurance;
      return '';
    };

    // Add helper function to get formatted balance
    const getFormattedBalance = (node: ExtendedNode) => {
      if (!node.balance) return '-';
      
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: node.balance.currency || 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(node.balance.amount);
    };

    return (
      <div className={css.root} style={style}>
        <div 
          onClick={clickHandler} 
          className={`${css.container} ${node.nodeType === 'person' ? css.personNode : ''} ${getAccountTypeClass(node)}`}
          data-type={node.nodeType}
          data-account-type={node.details?.accountType?.toLowerCase()}
        >
          <div className={css.content}>
            {node.nodeType === 'account' && (
              <>
                <div className={css.header}>
                  <div className={css.title} title={node.id}>
                    {node.id}
                  </div>
                  <div className={css.balance} title={getFormattedBalance(node)}>
                    {getFormattedBalance(node)}
                  </div>
                </div>
                <div className={css.subInfo}>
                  <span className={css.provider} title={node.providerName}>
                    {node.providerName}
                  </span>
                  {node.accountNumber && (
                    <span className={css.accountNumber} title={`****${node.accountNumber}`}>
                      ****{node.accountNumber.slice(-4)}
                    </span>
                  )}
                  <span className={css.details}>
                    details →
                  </span>
                </div>
              </>
            )}

            {node.nodeType === 'person' && (
              <>
                <div className={css.header}>
                  <div className={css.title} title={node.id}>
                    {node.id}
                  </div>
                  <div className={css.netWorth} title={formatCurrency(node.netWorth)}>
                    {formatCurrency(node.netWorth)}
                  </div>
                </div>
                <div className={css.subInfo}>
                </div>
              </>
            )}

            {(node.nodeType === 'company' || node.nodeType === 'trust') && (
              <>
                <div className={css.header}>
                  <div className={css.title} title={node.id}>
                    {node.id}
                  </div>
                </div>
                <div className={css.subInfo}>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  },
);