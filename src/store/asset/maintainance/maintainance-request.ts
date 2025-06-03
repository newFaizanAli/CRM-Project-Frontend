import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../../../utilities/const";
import { toastError } from "../../../utilities/toastUtils";
import { MaintenanceRequest } from "../../../utilities/types";

interface MaintenanceRequestState {
  requests: MaintenanceRequest[];
  isFetched: boolean;
  fetchRequests: () => Promise<void>;
  addRequest: (data: Omit<MaintenanceRequest, "_id">) => Promise<void>;
  updateRequest: (id: string, data: Partial<MaintenanceRequest>) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
}

const DUMMY_STORAGE_KEY = "dummy_maintainance_requests";

const useMaintenanceRequestStore = create<MaintenanceRequestState>((set, get) => ({
  requests: [],
  isFetched: false,

  fetchRequests: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyData: MaintenanceRequest[] = stored ? JSON.parse(stored) : [];
      set({ requests: dummyData, isFetched: true });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get<MaintenanceRequest[]>(
          `${ProjectURL}/api/maintainance_requests`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set({ requests: response.data, isFetched: true });
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  addRequest: async (data) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newItem: MaintenanceRequest = { _id: Date.now().toString(), ...data };
      const updated = [...state.requests, newItem];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ requests: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post<MaintenanceRequest>(
          `${ProjectURL}/api/maintainance_requests`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set((state) => ({
          requests: [...state.requests, response.data],
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updateRequest: async (id, data) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updatedItems = state.requests.map((item) =>
        item._id === id ? { ...item, ...data } : item
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updatedItems));
      set({ requests: updatedItems });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.put<MaintenanceRequest>(
          `${ProjectURL}/api/maintainance_requests/${id}`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        set((state) => ({
          requests: state.requests.map((item) =>
            item._id === id ? response.data : item
          ),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deleteRequest: async (id) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.requests.filter((item) => item._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ requests: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`${ProjectURL}/api/maintainance_requests/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          requests: state.requests.filter((item) => item._id !== id),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useMaintenanceRequestStore;
