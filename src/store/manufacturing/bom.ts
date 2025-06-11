import axios from "axios";
import { create } from "zustand";
import { BOM } from "../../utilities/types";
import { ProjectURL } from "../../utilities/const";
import { toastError } from "../../utilities/toastUtils";

interface BOMState {
  bom: BOM[];
  isFetched: boolean;

  fetchBOM: () => Promise<void>;
  addBOM: (bom: Omit<BOM, "_id">) => Promise<void>;
  updateBOM: (id: string, bom: Partial<BOM>) => Promise<void>;
  deleteBOM: (id: string) => Promise<void>;
}

const DUMMY_STORAGE_KEY = "dummy_bom";
const BackendURL = `bom`

const useBOMStore = create<BOMState>((set, get) => ({
  bom: [],
  isFetched: false,

  fetchBOM: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyData: BOM[] = stored ? JSON.parse(stored) : [];
      set({ bom: dummyData, isFetched: true });
    } else {
      try {
        const response = await axios.get(`${ProjectURL}/api/${BackendURL}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set({ bom: response.data, isFetched: true });
      } catch (err) {
        console.error("Failed to fetch BOM:", err);
        toastError("Failed to fetch BOM");
      }
    }
  },

  addBOM: async (bomData) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newBOM: BOM = { _id: Date.now().toString(), ...bomData };
      const updated = [...state.bom, newBOM];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ bom: updated });
    } else {
      try {
        const response = await axios.post(`${ProjectURL}/api/${BackendURL}`, bomData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set((state) => ({
          bom: [...state.bom, response.data],
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg || "Failed to add BOM");
      }
    }
  },

  updateBOM: async (id, bomData) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.bom.map((b) =>
        b._id === id ? { ...b, ...bomData } : b
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ bom: updated });
    } else {
      try {
        const response = await axios.put(`${ProjectURL}/api/${BackendURL}/${id}`, bomData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set((state) => ({
          bom: state.bom.map((b) => (b._id === id ? response.data : b)),
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg || "Failed to update BOM");
      }
    }
  },

  deleteBOM: async (id) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.bom.filter((b) => b._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ bom: updated });
    } else {
      try {
        await axios.delete(`${ProjectURL}/api/${BackendURL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set((state) => ({
          bom: state.bom.filter((b) => b._id !== id),
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg || "Failed to delete BOM");
      }
    }
  },
}));

export default useBOMStore;
