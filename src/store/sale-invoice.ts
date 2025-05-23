import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../utilities/const";
import {  SaleInvoice } from "../utilities/types";
import { toastError } from "../utilities/toastUtils";

interface SaleInvoiceState {
  saleInvoices: SaleInvoice[];
  isFetched: boolean;
  fetchSaleInvoices: () => Promise<void>;
  addSaleInvoice: (invoice: Omit<SaleInvoice, "_id">) => Promise<void>;
  updateSaleInvoice: (
    id: string,
    invoice: Partial<SaleInvoice>
  ) => Promise<void>;
  deleteSaleInvoice: (id: string) => Promise<void>;
}

const DUMMY_STORAGE_KEY = "dummy_sale_invoices";

const useSaleInvoiceStore = create<SaleInvoiceState>((set, get) => ({
  saleInvoices: [],
  isFetched: false,

  fetchSaleInvoices: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyInvoices: SaleInvoice[] = stored ? JSON.parse(stored) : [];
      set({ saleInvoices: dummyInvoices, isFetched: true });
    } else {
      try {
        const response = await axios.get(`${ProjectURL}/api/sale-invoices`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set({ saleInvoices: response.data, isFetched: true });
      } catch (err) {
        console.error("Failed to fetch sale invoices:", err);
      }
    }
  },

  addSaleInvoice: async (invoice) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newInvoice: SaleInvoice = { _id: Date.now().toString(), ...invoice };
      const updated = [...state.saleInvoices, newInvoice];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ saleInvoices: updated });
    } else {
      try {
        const response = await axios.post(
          `${ProjectURL}/api/sale-invoices`,
          invoice,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        set((state) => ({
          saleInvoices: [...state.saleInvoices, response.data],
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updateSaleInvoice: async (id, invoice) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updatedInvoices = state.saleInvoices.map((i) =>
        i._id === id ? { ...i, ...invoice } : i
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updatedInvoices));
      set({ saleInvoices: updatedInvoices });
    } else {
      try {
        const response = await axios.put(
          `${ProjectURL}/api/sale-invoices/${id}`,
          invoice,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const updatedInvoice = response.data;

        set((state) => ({
          saleInvoices: state.saleInvoices.map((i) =>
            i._id === id ? updatedInvoice : i
          ),
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deleteSaleInvoice: async (id) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.saleInvoices.filter((i) => i._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ saleInvoices: updated });
    } else {
      try {
        await axios.delete(`${ProjectURL}/api/sale-invoices/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set((state) => ({
          saleInvoices: state.saleInvoices.filter((i) => i._id !== id),
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useSaleInvoiceStore;