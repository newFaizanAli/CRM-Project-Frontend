import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../../utilities/const";
import { toastError } from "../../utilities/toastUtils";
import { SalaryStructure } from "../../utilities/types";


interface SalaryStructureState {
  salaryStructures: SalaryStructure[];
  isFetched: boolean;

  fetchSalaryStructures: () => Promise<void>;
  addSalaryStructure: (structure: Omit<SalaryStructure, "_id">) => Promise<void>;
  updateSalaryStructure: (id: string, updates: Partial<SalaryStructure>) => Promise<void>;
  deleteSalaryStructure: (id: string) => Promise<void>;
}

const DUMMY_STORAGE_KEY = "dummy_salary_structures";

const useSalaryStructureStore = create<SalaryStructureState>((set, get) => ({
  salaryStructures: [],
  isFetched: false,

  fetchSalaryStructures: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyData: SalaryStructure[] = stored ? JSON.parse(stored) : [];
      set({ salaryStructures: dummyData, isFetched: true });
    } else {
      try {
        const response = await axios.get(`${ProjectURL}/api/salary-structures`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set({ salaryStructures: response.data, isFetched: true });
      } catch (err) {
        console.error("Failed to fetch salary structures:", err);
      }
    }
  },

  addSalaryStructure: async (structure) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newStructure: SalaryStructure = {
        _id: Date.now().toString(),
        ...structure,
      };
      const updated = [...state.salaryStructures, newStructure];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ salaryStructures: updated });
    } else {
      try {
        const response = await axios.post(`${ProjectURL}/api/salary-structures`, structure, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          salaryStructures: [...state.salaryStructures, response.data],
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updateSalaryStructure: async (id, updates) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updatedStructures = state.salaryStructures.map((s) =>
        s._id === id ? { ...s, ...updates } : s
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updatedStructures));
      set({ salaryStructures: updatedStructures });
    } else {
      try {
        const response = await axios.put(
          `${ProjectURL}/api/salary-structures/${id}`,
          updates,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const updatedStructure = response.data;
        set((state) => ({
          salaryStructures: state.salaryStructures.map((s) =>
            s._id === id ? updatedStructure : s
          ),
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deleteSalaryStructure: async (id) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.salaryStructures.filter((s) => s._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ salaryStructures: updated });
    } else {
      try {
        await axios.delete(`${ProjectURL}/api/salary-structures/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          salaryStructures: state.salaryStructures.filter((s) => s._id !== id),
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useSalaryStructureStore;
