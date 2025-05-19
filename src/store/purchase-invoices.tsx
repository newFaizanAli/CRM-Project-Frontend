import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../utilities/const";
import { PurchaseInvoice } from "../utilities/types";
import { toastError } from "../utilities/toastUtils";

interface PurchaseInvoiceState {
  purchaseInvoices: PurchaseInvoice[];
  isFetched: boolean;
  fetchPurchaseInvoices: () => Promise<void>;
  addPurchaseInvoice: (invoice: Omit<PurchaseInvoice, "_id">) => Promise<void>;
  updatePurchaseInvoice: (
    id: string,
    invoice: Partial<PurchaseInvoice>
  ) => Promise<void>;
  deletePurchaseInvoice: (id: string) => Promise<void>;
}

const DUMMY_STORAGE_KEY = "dummy_purchase_invoices";

const usePurchaseInvoiceStore = create<PurchaseInvoiceState>((set, get) => ({
  purchaseInvoices: [],
  isFetched: false,

  fetchPurchaseInvoices: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyInvoices: PurchaseInvoice[] = stored ? JSON.parse(stored) : [];
      set({ purchaseInvoices: dummyInvoices, isFetched: true });
    } else {
      try {
        const response = await axios.get(`${ProjectURL}/api/purchase-invoices`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set({ purchaseInvoices: response.data, isFetched: true });
      } catch (err) {
        console.error("Failed to fetch purchase invoices:", err);
      }
    }
  },

  addPurchaseInvoice: async (invoice) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newInvoice: PurchaseInvoice = { _id: Date.now().toString(), ...invoice };
      const updated = [...state.purchaseInvoices, newInvoice];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ purchaseInvoices: updated });
    } else {
      try {
        const response = await axios.post(
          `${ProjectURL}/api/purchase-invoices`,
          invoice,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        set((state) => ({
          purchaseInvoices: [...state.purchaseInvoices, response.data],
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updatePurchaseInvoice: async (id, invoice) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updatedInvoices = state.purchaseInvoices.map((i) =>
        i._id === id ? { ...i, ...invoice } : i
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updatedInvoices));
      set({ purchaseInvoices: updatedInvoices });
    } else {
      try {
        const response = await axios.put(
          `${ProjectURL}/api/purchase-invoices/${id}`,
          invoice,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const updatedInvoice = response.data;

        set((state) => ({
          purchaseInvoices: state.purchaseInvoices.map((i) =>
            i._id === id ? updatedInvoice : i
          ),
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deletePurchaseInvoice: async (id) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.purchaseInvoices.filter((i) => i._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ purchaseInvoices: updated });
    } else {
      try {
        await axios.delete(`${ProjectURL}/api/purchase-invoices/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set((state) => ({
          purchaseInvoices: state.purchaseInvoices.filter((i) => i._id !== id),
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default usePurchaseInvoiceStore;