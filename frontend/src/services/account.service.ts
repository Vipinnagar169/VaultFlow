import { api } from '../lib/axios';
import type { Account, LedgerListResponse, TotalBalanceResponse } from '../types';

export const accountService = {
  async getAccounts(): Promise<Account[]> {
    const res = await api.get<{ accounts: Account[] }>('/api/accounts/');
    return res.data.accounts;
  },

  async createAccount(): Promise<Account> {
    const res = await api.post<{ account: Account }>('/api/accounts/');
    return res.data.account;
  },

  async getBalance(accountId: string): Promise<number> {
    const res = await api.get<{ balance: number }>(`/api/accounts/balance/${accountId}`);
    return res.data.balance;
  },

  async getTotalBalance(): Promise<TotalBalanceResponse> {
    const res = await api.get<TotalBalanceResponse>('/api/accounts/total-balance');
    return res.data;
  },

  async getLedger(accountId: string, page = 1, limit = 30): Promise<LedgerListResponse> {
    const res = await api.get<LedgerListResponse>(`/api/accounts/${accountId}/ledger`, {
      params: { page, limit },
    });
    return res.data;
  },
};
