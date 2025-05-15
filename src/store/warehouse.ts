import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../utilities/const";
import { Warehouse } from "../utilities/types";
import { toastError } from "../utilities/toastUtils";

interface WarehousesState {
  warehouses: Warehouse[];
  isFetched: boolean;
  fetchWarehouses: () => Promise<void>;
  addWarehouse: (warehouse: Omit<Warehouse, "_id" | "ID">) => Promise<void>;
  updateWarehouse: (id: number, warehouse: Partial<Warehouse>) => Promise<void>;
  deleteWarehouse: (id: number) => Promise<void>;
}

const DUMMY_STORAGE_KEY = "dummy_warehouses";

const useWarehouseStore = create<WarehousesState>((set, get) => ({
  warehouses: [],
  isFetched: false,

  fetchWarehouses: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyWarehouses: Warehouse[] = stored ? JSON.parse(stored) : [];
      set({ warehouses: dummyWarehouses, isFetched: true });
    } else {
      try {
        const response = await axios.get(`${ProjectURL}/api/warehouses`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        set({ warehouses: response.data, isFetched: true });
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  addWarehouse: async (warehouse) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newId = Date.now();

      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const existing: Warehouse[] = stored ? JSON.parse(stored) : [];

      const lastNumber = existing.reduce((max: number, wh: Warehouse) => {
        const match = wh.ID?.match(/WH-(\d+)/);
        const num = match ? parseInt(match[1], 10) : 0;
        return Math.max(max, num);
      }, 0);

      const nextNumber = lastNumber + 1;
      const ID = `WH-${String(nextNumber).padStart(4, "0")}`;

      const newWarehouse: Warehouse = {
        _id: newId,
        ID,
        isActive: true,
        ...warehouse,
      };

      const updated = [...state.warehouses, newWarehouse];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ warehouses: updated });
    } else {
      try {
        const response = await axios.post(
          `${ProjectURL}/api/warehouses`,
          warehouse,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        set((state) => ({
          warehouses: [...state.warehouses, response.data],
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updateWarehouse: async (id, warehouse) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.warehouses.map((w) =>
        w._id === id ? { ...w, ...warehouse } : w
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ warehouses: updated });
    } else {
      try {
        await axios.put(`${ProjectURL}/api/warehouses/${id}`, warehouse, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        set((state) => ({
          warehouses: state.warehouses.map((w) =>
            w._id === id ? { ...w, ...warehouse } : w
          ),
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deleteWarehouse: async (id) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.warehouses.filter((w) => w._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ warehouses: updated });
    } else {
      try {
        await axios.delete(`${ProjectURL}/api/warehouses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        set((state) => ({
          warehouses: state.warehouses.filter((w) => w._id !== id),
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useWarehouseStore;
