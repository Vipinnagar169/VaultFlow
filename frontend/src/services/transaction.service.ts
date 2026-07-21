import { api } from '../lib/axios';
import type { Transaction, TransactionListResponse } from '../types';

interface CreateTransactionPayload {
  fromAccount: string;
  toAccount: string;
  amount: number;
  idempotencyKey: string;
}

export const transactionService = {
  async createTransaction(data: CreateTransactionPayload): Promise<Transaction> {
    const res = await api.post<{ transaction: Transaction; message: string }>(
      '/api/transactions/',
      data
    );
    return res.data.transaction;
  },

  async getTransactionsByAccount(
    accountId: string,
    page = 1,
    limit = 20
  ): Promise<TransactionListResponse> {
    const res = await api.get<TransactionListResponse>(
      `/api/transactions/account/${accountId}`,
      { params: { page, limit } }
    );
    return res.data;
  },

  async getTransactionById(
    transactionId: string
  ): Promise<{ transaction: Transaction; ledgerEntries: any[] }> {
    const res = await api.get(`/api/transactions/${transactionId}`);
    return res.data;
  },
};
