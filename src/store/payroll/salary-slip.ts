import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../../utilities/const";
import { SalarySlip } from "../../utilities/types";
import { toastError } from "../../utilities/toastUtils";

interface SalarySlipState {
  salarySlips: SalarySlip[];
  isFetched: boolean;
  fetchSalarySlips: () => Promise<void>;
  addSalarySlip: (data: Omit<SalarySlip, "_id">) => Promise<void>;
  updateSalarySlip: (id: string, data: Partial<SalarySlip>) => Promise<void>;
  deleteSalarySlip: (id: string) => Promise<void>;
}

const DUMMY_STORAGE_KEY = "dummy_salary_slips";

const useSalarySlipStore = create<SalarySlipState>((set, get) => ({
  salarySlips: [],
  isFetched: false,

  fetchSalarySlips: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyData: SalarySlip[] = stored ? JSON.parse(stored) : [];
      set({ salarySlips: dummyData, isFetched: true });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get<SalarySlip[]>(
          `${ProjectURL}/api/salary-slips`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set({ salarySlips: response.data, isFetched: true });
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  addSalarySlip: async (data) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newItem: SalarySlip = { _id: Date.now().toString(), ...data };
      const updated = [...state.salarySlips, newItem];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ salarySlips: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post<SalarySlip>(
          `${ProjectURL}/api/salary-slips`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set((state) => ({
          salarySlips: [...state.salarySlips, response.data],
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updateSalarySlip: async (id, data) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updatedItems = state.salarySlips.map((item) =>
        item._id === id ? { ...item, ...data } : item
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updatedItems));
      set({ salarySlips: updatedItems });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.put<SalarySlip>(
          `${ProjectURL}/api/salary-slips/${id}`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        set((state) => ({
          salarySlips: state.salarySlips.map((item) =>
            item._id === id ? response.data : item
          ),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deleteSalarySlip: async (id) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.salarySlips.filter((item) => item._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ salarySlips: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`${ProjectURL}/api/salary-slips/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          salarySlips: state.salarySlips.filter((item) => item._id !== id),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useSalarySlipStore;
