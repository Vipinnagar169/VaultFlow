// Types for the VaultFlow application

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Account {
  _id: string;
  user: string;
  status: 'ACTIVE' | 'FROZEN' | 'CLOSED';
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountWithBalance extends Account {
  balance: number;
}

export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED';
export type LedgerType = 'CREDIT' | 'DEBIT';

export interface Transaction {
  _id: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  status: TransactionStatus;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface LedgerEntry {
  _id: string;
  account: string;
  amount: number;
  transaction: string | Transaction;
  type: LedgerType;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  pagination: Pagination;
}

export interface LedgerListResponse {
  entries: LedgerEntry[];
  pagination: Pagination;
}

// API Response wrappers
export interface ApiError {
  message: string;
  status?: string;
}

