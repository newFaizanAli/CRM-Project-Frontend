import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../utilities/const";
import { SaleReturn } from "../utilities/types";
import { toastError } from "../utilities/toastUtils";

interface SalesReturnState {
  salesReturns: SaleReturn[];
  isFetched: boolean;
  fetchSalesReturns: () => Promise<void>;
  addSalesReturn: (returnData: Omit<SaleReturn, "_id">) => Promise<void>;
  updateSalesReturn: (
    id: string,
    returnData: Partial<SaleReturn>
  ) => Promise<void>;
  deleteSalesReturn: (id: string) => Promise<void>;
}

const DUMMY_STORAGE_KEY = "dummy_sales_returns";

const useSalesReturnStore = create<SalesReturnState>((set, get) => ({
  salesReturns: [],
  isFetched: false,

  fetchSalesReturns: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyReturns: SaleReturn[] = stored ? JSON.parse(stored) : [];
      set({ salesReturns: dummyReturns, isFetched: true });
    } else {
      try {
        const response = await axios.get(`${ProjectURL}/api/sale-returns`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set({ salesReturns: response.data, isFetched: true });
      } catch (err) {
        console.error("Failed to fetch sales returns:", err);
      }
    }
  },

  addSalesReturn: async (returnData) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newReturn: SaleReturn = { _id: Date.now().toString(), ...returnData };
      const updated = [...state.salesReturns, newReturn];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ salesReturns: updated });
    } else {
      try {
        const response = await axios.post(
          `${ProjectURL}/api/sale-returns`,
          returnData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        set((state) => ({
          salesReturns: [...state.salesReturns, response.data],
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updateSalesReturn: async (id, returnData) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updatedReturns = state.salesReturns.map((r) =>
        r._id === id ? { ...r, ...returnData } : r
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updatedReturns));
      set({ salesReturns: updatedReturns });
    } else {
      try {
        const response = await axios.put(
          `${ProjectURL}/api/sale-returns/${id}`,
          returnData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const updatedReturn = response.data;

        set((state) => ({
          salesReturns: state.salesReturns.map((r) =>
            r._id === id ? updatedReturn : r
          ),
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deleteSalesReturn: async (id) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.salesReturns.filter((r) => r._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ salesReturns: updated });
    } else {
      try {
        await axios.delete(`${ProjectURL}/api/sale-returns/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set((state) => ({
          salesReturns: state.salesReturns.filter((r) => r._id !== id),
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useSalesReturnStore;
