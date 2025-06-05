import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../../../utilities/const";
import { toastError } from "../../../utilities/toastUtils";
import { MaintenanceLog } from "../../../utilities/types";

interface MaintenanceLogState {
  logs: MaintenanceLog[];
  isFetched: boolean;
  fetchLogs: () => Promise<void>;
  addLog: (data: Omit<MaintenanceLog, "_id">) => Promise<void>;
  updateLog: (id: string, data: Partial<MaintenanceLog>) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
}

const DUMMY_STORAGE_KEY = "dummy_maintenance_logs";

const useMaintenanceLogStore = create<MaintenanceLogState>((set, get) => ({
  logs: [],
  isFetched: false,

  fetchLogs: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyData: MaintenanceLog[] = stored ? JSON.parse(stored) : [];
      set({ logs: dummyData, isFetched: true });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get<MaintenanceLog[]>(
          `${ProjectURL}/api/maintenance_logs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set({ logs: response.data, isFetched: true });
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  addLog: async (data) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newItem: MaintenanceLog = { _id: Date.now().toString(), ...data };
      const updated = [...state.logs, newItem];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ logs: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        
        const response = await axios.post<MaintenanceLog>(
          `${ProjectURL}/api/maintenance_logs`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set((state) => ({
          logs: [...state.logs, response.data],
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updateLog: async (id, data) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updatedItems = state.logs.map((item) =>
        item._id === id ? { ...item, ...data } : item
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updatedItems));
      set({ logs: updatedItems });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.put<MaintenanceLog>(
          `${ProjectURL}/api/maintenance_logs/${id}`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        set((state) => ({
          logs: state.logs.map((item) =>
            item._id === id ? response.data : item
          ),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deleteLog: async (id) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.logs.filter((item) => item._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ logs: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`${ProjectURL}/api/maintenance_logs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          logs: state.logs.filter((item) => item._id !== id),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useMaintenanceLogStore;
