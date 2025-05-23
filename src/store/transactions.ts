// src/store/transactionStore.ts
import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../utilities/const";
import { Transaction } from "../utilities/types"; 
import { toastError } from "../utilities/toastUtils";

interface TransactionState {
  transactions: Transaction[];
  isFetched: boolean;

  fetchTransactions: () => Promise<void>;
  addTransaction: (data: Omit<Transaction, "_id">) => Promise<void>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

const DUMMY_STORAGE_KEY = "dummy_transactions";

const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isFetched: false,

  fetchTransactions: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyData: Transaction[] = stored ? JSON.parse(stored) : [];
      set({ transactions: dummyData, isFetched: true });
    } else {
      try {
        const res = await axios.get(`${ProjectURL}/api/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set({ transactions: res.data, isFetched: true });
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        toastError("Failed to fetch transactions");
      }
    }
  },

  addTransaction: async (data) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newData: Transaction = { _id: Date.now().toString(), ...data };
      const updated = [...state.transactions, newData];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ transactions: updated });
    } else {
      try {
        const res = await axios.post(`${ProjectURL}/api/transactions`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          transactions: [...state.transactions, res.data],
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg || "Failed to add transaction");
      }
    }
  },

  updateTransaction: async (id, data) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.transactions.map((t) =>
        t._id === id ? { ...t, ...data } : t
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ transactions: updated });
    } else {
      try {
        const res = await axios.put(`${ProjectURL}/api/transactions/${id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t._id === id ? res.data : t
          ),
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg || "Failed to update transaction");
      }
    }
  },

  deleteTransaction: async (id) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.transactions.filter((t) => t._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ transactions: updated });
    } else {
      try {
        await axios.delete(`${ProjectURL}/api/transactions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          transactions: state.transactions.filter((t) => t._id !== id),
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg || "Failed to delete transaction");
      }
    }
  },
}));

export default useTransactionStore;
