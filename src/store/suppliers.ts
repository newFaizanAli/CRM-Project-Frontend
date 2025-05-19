import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../utilities/const";
import { Supplier } from "../utilities/types";
import { toastError } from "../utilities/toastUtils";

interface SupplierState {
  suppliers: Supplier[];
  isFetched: boolean;
  fetchSuppliers: () => Promise<void>;

  addSupplier: (supplier: Omit<Supplier, "_id">) => Promise<void>;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: string) => void;
}

const DUMMY_STORAGE_KEY = "dummy_suppliers";

const useSupplierStore = create<SupplierState>((set, get) => ({
  suppliers: [],
  isFetched: false,

  fetchSuppliers: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";
    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummySuppliers: Supplier[] = stored ? JSON.parse(stored) : [];
      set({ suppliers: dummySuppliers, isFetched: true });
    } else {
      try {
        const response = await axios.get(`${ProjectURL}/api/suppliers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set({ suppliers: response.data, isFetched: true });
      } catch (err) {
        console.error("Failed to fetch suppliers:", err);
      }
    }
  },

  addSupplier: async (supplier) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newSupplier: Supplier = { _id: Date.now().toString(), ...supplier };
      const updated = [...state.suppliers, newSupplier];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ suppliers: updated });
    } else {
      try {
        const response = await axios.post(`${ProjectURL}/api/suppliers`, supplier, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set((state) => ({
          suppliers: [...state.suppliers, response.data],
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updateSupplier: async (id, supplier) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updatedSuppliers = state.suppliers.map((s) =>
        s._id === id ? { ...s, ...supplier } : s
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updatedSuppliers));
      set({ suppliers: updatedSuppliers });
    } else {
      try {
        await axios.put(`${ProjectURL}/api/suppliers/${id}`, supplier, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set((state) => ({
          suppliers: state.suppliers.map((s) =>
            s._id === id ? { ...s, ...supplier } : s
          ),
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deleteSupplier: async (id) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.suppliers.filter((s) => s._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ suppliers: updated });
    } else {
      try {
        await axios.delete(`${ProjectURL}/api/suppliers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set((state) => ({
          suppliers: state.suppliers.filter((s) => s._id !== id),
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useSupplierStore;
