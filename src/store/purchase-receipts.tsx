import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../utilities/const";
import { PurchaseReceipt } from "../utilities/types";
import { toastError } from "../utilities/toastUtils";

interface PurchaseReceiptState {
  purchaseReceipts: PurchaseReceipt[];
  isFetched: boolean;
  fetchPurchaseReceipts: () => Promise<void>;

  addPurchaseReceipt: (receipt: Omit<PurchaseReceipt, "_id">) => Promise<void>;
  updatePurchaseReceipt: (
    id: string,
    receipt: Partial<PurchaseReceipt>
  ) => Promise<void>;
  deletePurchaseReceipt: (id: string) => void;
}

const DUMMY_STORAGE_KEY = "dummy_purchase_receipts";

const usePurchaseReceiptStore = create<PurchaseReceiptState>((set, get) => ({
  purchaseReceipts: [],
  isFetched: false,

  fetchPurchaseReceipts: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyReceipts: PurchaseReceipt[] = stored ? JSON.parse(stored) : [];
      set({ purchaseReceipts: dummyReceipts, isFetched: true });
    } else {
      try {
        const response = await axios.get(`${ProjectURL}/api/purchase-receipts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set({ purchaseReceipts: response.data, isFetched: true });
      } catch (err) {
        console.error("Failed to fetch purchase receipts:", err);
      }
    }
  },

  addPurchaseReceipt: async (receipt) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newReceipt: PurchaseReceipt = { _id: Date.now().toString(), ...receipt };
      const updated = [...state.purchaseReceipts, newReceipt];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ purchaseReceipts: updated });
    } else {
      try {
        const response = await axios.post(
          `${ProjectURL}/api/purchase-receipts`,
          receipt,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        set((state) => ({
          purchaseReceipts: [...state.purchaseReceipts, response.data],
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updatePurchaseReceipt: async (id, receipt) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updatedReceipts = state.purchaseReceipts.map((r) =>
        r._id === id ? { ...r, ...receipt } : r
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updatedReceipts));
      set({ purchaseReceipts: updatedReceipts });
    } else {
      try {
        const response = await axios.put(
          `${ProjectURL}/api/purchase-receipts/${id}`,
          receipt,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const updatedReceipt = response.data;

        set((state) => ({
          purchaseReceipts: state.purchaseReceipts.map((r) =>
            r._id === id ? updatedReceipt : r
          ),
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deletePurchaseReceipt: async (id) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.purchaseReceipts.filter((r) => r._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ purchaseReceipts: updated });
    } else {
      try {
        await axios.delete(`${ProjectURL}/api/purchase-receipts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set((state) => ({
          purchaseReceipts: state.purchaseReceipts.filter((r) => r._id !== id),
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default usePurchaseReceiptStore;
