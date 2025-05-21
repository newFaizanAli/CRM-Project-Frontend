import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../utilities/const";
import { PurchaseReturn } from "../utilities/types";
import { toastError } from "../utilities/toastUtils";

interface PurchaseReturnState {
  purchaseReturns: PurchaseReturn[];
  isFetched: boolean;
  fetchPurchaseReturns: () => Promise<void>;
  addPurchaseReturn: (returnData: Omit<PurchaseReturn, "_id">) => Promise<void>;
  updatePurchaseReturn: (
    id: string,
    returnData: Partial<PurchaseReturn>
  ) => Promise<void>;
  deletePurchaseReturn: (id: string) => Promise<void>;
}

const DUMMY_STORAGE_KEY = "dummy_purchase_returns";

const usePurchaseReturnStore = create<PurchaseReturnState>((set, get) => ({
  purchaseReturns: [],
  isFetched: false,

  fetchPurchaseReturns: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyReturns: PurchaseReturn[] = stored ? JSON.parse(stored) : [];
      set({ purchaseReturns: dummyReturns, isFetched: true });
    } else {
      try {
        const response = await axios.get(`${ProjectURL}/api/purchase-returns`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set({ purchaseReturns: response.data, isFetched: true });
      } catch (err) {
        console.error("Failed to fetch purchase returns:", err);
      }
    }
  },

  addPurchaseReturn: async (returnData) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newReturn: PurchaseReturn = { _id: Date.now().toString(), ...returnData };
      const updated = [...state.purchaseReturns, newReturn];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ purchaseReturns: updated });
    } else {
      try {
        const response = await axios.post(
          `${ProjectURL}/api/purchase-returns`,
          returnData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        set((state) => ({
          purchaseReturns: [...state.purchaseReturns, response.data],
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updatePurchaseReturn: async (id, returnData) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updatedReturns = state.purchaseReturns.map((r) =>
        r._id === id ? { ...r, ...returnData } : r
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updatedReturns));
      set({ purchaseReturns: updatedReturns });
    } else {
      try {
        const response = await axios.put(
          `${ProjectURL}/api/purchase-returns/${id}`,
          returnData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const updatedReturn = response.data;

        set((state) => ({
          purchaseReturns: state.purchaseReturns.map((r) =>
            r._id === id ? updatedReturn : r
          ),
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deletePurchaseReturn: async (id) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.purchaseReturns.filter((r) => r._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ purchaseReturns: updated });
    } else {
      try {
        await axios.delete(`${ProjectURL}/api/purchase-returns/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set((state) => ({
          purchaseReturns: state.purchaseReturns.filter((r) => r._id !== id),
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default usePurchaseReturnStore;