import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../../utilities/const";
import { SalaryComponent } from "../../utilities/types";
import { toastError } from "../../utilities/toastUtils";

interface SalaryComponentState {
  salaryComponents: SalaryComponent[];
  isFetched: boolean;
  fetchSalaryComponents: () => Promise<void>;
  addSalaryComponent: (data: Omit<SalaryComponent, "_id">) => Promise<void>;
  updateSalaryComponent: (id: string, data: Partial<SalaryComponent>) => Promise<void>;
  deleteSalaryComponent: (id: string) => Promise<void>;
}

const DUMMY_STORAGE_KEY = "dummy_salary_components";

const useSalaryComponentStore = create<SalaryComponentState>((set, get) => ({
  salaryComponents: [],
  isFetched: false,

  fetchSalaryComponents: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyData: SalaryComponent[] = stored ? JSON.parse(stored) : [];
      set({ salaryComponents: dummyData, isFetched: true });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get<SalaryComponent[]>(
          `${ProjectURL}/api/salary-components`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set({ salaryComponents: response.data, isFetched: true });
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  addSalaryComponent: async (data) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newItem: SalaryComponent = { _id: Date.now().toString(), ...data };
      const updated = [...state.salaryComponents, newItem];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ salaryComponents: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post<SalaryComponent>(
          `${ProjectURL}/api/salary-components`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set((state) => ({
          salaryComponents: [...state.salaryComponents, response.data],
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updateSalaryComponent: async (id, data) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updatedItems = state.salaryComponents.map((item) =>
        item._id === id ? { ...item, ...data } : item
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updatedItems));
      set({ salaryComponents: updatedItems });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.put<SalaryComponent>(
          `${ProjectURL}/api/salary-components/${id}`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        set((state) => ({
          salaryComponents: state.salaryComponents.map((item) =>
            item._id === id ? response.data : item
          ),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deleteSalaryComponent: async (id) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.salaryComponents.filter((item) => item._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ salaryComponents: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`${ProjectURL}/api/salary-components/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          salaryComponents: state.salaryComponents.filter((item) => item._id !== id),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useSalaryComponentStore;
