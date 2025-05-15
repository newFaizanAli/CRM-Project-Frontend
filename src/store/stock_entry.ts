import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../utilities/const";
import { StockEntry } from "../utilities/types";
import { toastError } from "../utilities/toastUtils";

interface StockEntryState {
  stockentry: StockEntry[];
  isFetched: boolean;
  fetchStockEntries: () => Promise<void>;
  addStockEntry: (entry: Omit<StockEntry, "_id">) => Promise<void>;
  updateStockEntry: (id: string, entry: Partial<StockEntry>) => Promise<void>;
  deleteStockEntry: (id: string) => Promise<void>;
}

const DUMMY_STORAGE_KEY = "dummy_stockentry";

const useStockEntryStore = create<StockEntryState>((set, get) => ({
  stockentry: [],
  isFetched: false,

  fetchStockEntries: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummy: StockEntry[] = stored ? JSON.parse(stored) : [];
      set({ stockentry: dummy, isFetched: true });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get<StockEntry[]>(
          `${ProjectURL}/api/stock-entry`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set({ stockentry: response.data, isFetched: true });
      } catch (error) {
        const msg = error?.response?.data?.message;
               toastError(msg);
      }
    }
  },

  addStockEntry: async (entry) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newEntry: StockEntry = { _id: Date.now(), ...entry };
      const updated = [...state.stockentry, newEntry];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ stockentry: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post<StockEntry>(
          `${ProjectURL}/api/stock-entry`,
          entry,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set((state) => ({
          stockentry: [...state.stockentry, response.data],
        }));
      } catch (error) {
         const msg = error?.response?.data?.message;
                toastError(msg);
      }
    }
  },

  updateStockEntry: async (id, entry) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.stockentry.map((e) =>
        e._id?.toString() === id ? { ...e, ...entry } : e
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ stockentry: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.put<StockEntry>(
          `${ProjectURL}/api/stock-entry/${id}`,
          entry,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        set((state) => ({
          stockentry: state.stockentry.map((e) =>
            e._id?.toString() === id ? response.data : e
          ),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deleteStockEntry: async (id) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.stockentry.filter((e) => e._id?.toString() !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ stockentry: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`${ProjectURL}/api/stock-entry/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          stockentry: state.stockentry.filter((e) => e._id?.toString() !== id),
        }));
      } catch (error) {
         const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useStockEntryStore;
