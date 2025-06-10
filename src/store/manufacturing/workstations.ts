import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../../utilities/const";
import { Workstation } from "../../utilities/types";
import { toastError } from "../../utilities/toastUtils";

interface WorkstationState {
  workstations: Workstation[];
  isFetched: boolean;
  fetchWorkstations: () => Promise<void>;
  addWorkstation: (workstation: Omit<Workstation, "_id">) => Promise<void>;
  updateWorkstation: (id: string, data: Partial<Workstation>) => Promise<void>;
  deleteWorkstation: (id: string) => Promise<void>;
}

const DUMMY_STORAGE_KEY = "dummy_workstations";
const BackendURL = `workstations`;

const useWorkstationStore = create<WorkstationState>((set, get) => ({
  workstations: [],
  isFetched: false,

  fetchWorkstations: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyData: Workstation[] = stored ? JSON.parse(stored) : [];
      set({ workstations: dummyData, isFetched: true });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get<Workstation[]>(
          `${ProjectURL}/api/${BackendURL}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set({ workstations: response.data, isFetched: true });
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  addWorkstation: async (workstation) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newItem: Workstation = { _id: Date.now().toString(), ...workstation };
      const updated = [...state.workstations, newItem];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ workstations: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post<Workstation>(
          `${ProjectURL}/api/${BackendURL}`,
          workstation,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set((state) => ({
          workstations: [...state.workstations, response.data],
          
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updateWorkstation: async (id, data) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.workstations.map((w) =>
        w._id === id ? { ...w, ...data } : w
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ workstations: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.put<Workstation>(
          `${ProjectURL}/api/${BackendURL}/${id}`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        set((state) => ({
          workstations: state.workstations.map((w) =>
            w._id === id ? response.data : w
          ),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deleteWorkstation: async (id) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.workstations.filter((w) => w._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ workstations: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`${ProjectURL}/api/${BackendURL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          workstations: state.workstations.filter((w) => w._id !== id),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useWorkstationStore;
