import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../utilities/const";
import { Employee } from "../utilities/types";
import { toastError } from "../utilities/toastUtils";

interface EmployeesState {
  employees: Employee[];
  isFetched: boolean;
  fetchEmployees: () => Promise<void>;

  addEmployee: (lead: Omit<Employee, "id">) => void;
  updateEmployee: (id: number, contact: Partial<Employee>) => void;
  deleteEmployee: (id: number) => void;
}

const DUMMY_STORAGE_KEY = "dummy_employees";

const useEmployeesStore = create<EmployeesState>((set, get) => ({
  employees: [],
  isFetched: false,

  fetchEmployees: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";
    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyEmployees: Employee[] = stored ? JSON.parse(stored) : [];
      set({ employees: dummyEmployees, isFetched: true });
    } else {
      try {
        const response = await axios.get(`${ProjectURL}/api/employees`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const fetchedEmployees = response.data;
        set({ employees: fetchedEmployees, isFetched: true });
      } catch (err) {
        console.error("Failed to fetch employees:", err);
      }
    }
  },

  addEmployee: async (employee) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";
    if (isDummy) {
      const state = get();
      const DUMMY_STORAGE_KEY = "dummy_employees";
      const newId = Date.now();

      const existing = JSON.parse(
        localStorage.getItem(DUMMY_STORAGE_KEY) || "[]"
      );

      const lastEmpNumber = existing.reduce((max: number, emp: Employee) => {
        const match = emp.ID?.match(/EMP-(\d+)/);
        const num = match ? parseInt(match[1], 10) : 0;
        return num > max ? num : max;
      }, 0);

      const nextEmpNumber = lastEmpNumber + 1;
      const empID = `EMP-${String(nextEmpNumber).padStart(4, "0")}`; // e.g., EMP-0002

      const newEmployee: Employee = {
        _id: newId,
        ID: empID,
        ...employee,
      };

      const updated = [...state.employees, newEmployee];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ employees: updated });
    } else {
      try {
        const response = await axios.post(
          `${ProjectURL}/api/employees`,
          employee,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const newEmployee = response.data;

        set((state) => ({
          employees: [...state.employees, newEmployee],
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updateEmployee: async (id, employee) => {
    const token = localStorage.getItem("token");

    const isDummy = localStorage.getItem("accounttype") === "dummy";
    if (isDummy) {
      const state = get();
      const updateEmployee = state.employees.map((c) =>
        c._id === id ? { ...c, ...employee } : c
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updateEmployee));
      set({ employees: updateEmployee });
    } else {
      try {
        await axios.put(`${ProjectURL}/api/employees/${id}`, employee, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        set((state) => ({
          employees: state.employees.map((l) =>
            l._id === id ? { ...l, ...employee } : l
          ),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deleteEmployee: async (id) => {
    const token = localStorage.getItem("token");

    const isDummy = localStorage.getItem("accounttype") === "dummy";
    if (isDummy) {
      const state = get();
      const updated = state.employees.filter((c) => c._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ employees: updated });
    } else {
      try {
        await axios.delete(`${ProjectURL}/api/employees/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        set((state) => ({
          employees: state.employees.filter((employee) => employee._id !== id),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useEmployeesStore;
