import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../utilities/const";
import { Department } from "../utilities/types"; 
import { toastError } from "../utilities/toastUtils";

interface DepartmentsState {
  departments: Department[];
  isFetched: boolean;
  fetchDepartments: () => Promise<void>;
  addDepartment: (department: Omit<Department, "_id">) => Promise<void>;
  updateDepartment: (id: string, department: Partial<Department>) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
}

const DUMMY_STORAGE_KEY = "dummy_departments";

const useDepartmentsStore = create<DepartmentsState>((set, get) => ({
  departments: [],
  isFetched: false,

  fetchDepartments: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyDepartments: Department[] = stored ? JSON.parse(stored) : [];
      set({ departments: dummyDepartments, isFetched: true });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get<Department[]>(
          `${ProjectURL}/api/departments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set({ departments: response.data, isFetched: true });
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  addDepartment: async (department) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newDepartment: Department = { _id: Date.now().toString(), ...department };
      const updated = [...state.departments, newDepartment];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ departments: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post<Department>(
          `${ProjectURL}/api/departments`,
          department,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set((state) => ({
          departments: [...state.departments, response.data],
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updateDepartment: async (id, department) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    const { ...safeDepartment } = department;

    if (isDummy) {
      const state = get();
      const updatedDepartments = state.departments.map((d) =>
        d._id === id ? { ...d, ...safeDepartment } : d
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updatedDepartments));
      set({ departments: updatedDepartments });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.put<Department>(
          `${ProjectURL}/api/departments/${id}`,
          safeDepartment,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        set((state) => ({
          departments: state.departments.map((d) =>
            d._id === id ? response.data : d
          ),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deleteDepartment: async (id) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.departments.filter((d) => d._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ departments: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`${ProjectURL}/api/departments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          departments: state.departments.filter((d) => d._id !== id),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useDepartmentsStore;
