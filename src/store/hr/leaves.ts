import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../../utilities/const";
import { Leave } from "../../utilities/types";
import { toastError } from "../../utilities/toastUtils";

interface LeaveState {
  leaves: Leave[];
  isFetched: boolean;
  fetchLeaves: () => Promise<void>;
  addLeave: (leave: Omit<Leave, "_id">) => Promise<void>;
  updateLeave: (id: string, leave: Partial<Leave>) => Promise<void>;
  deleteLeave: (id: string) => Promise<void>;
}

const DUMMY_LEAVE_KEY = "dummy_leaves";

const useLeaveStore = create<LeaveState>((set, get) => ({
  leaves: [],
  isFetched: false,

  fetchLeaves: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_LEAVE_KEY);
      const dummyData: Leave[] = stored ? JSON.parse(stored) : [];
      set({ leaves: dummyData, isFetched: true });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get<Leave[]>(
          `${ProjectURL}/api/leaves`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set({ leaves: response.data, isFetched: true });
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  addLeave: async (leave) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newLeave: Leave = { _id: Date.now().toString(), ...leave };
      const updated = [...state.leaves, newLeave];
      localStorage.setItem(DUMMY_LEAVE_KEY, JSON.stringify(updated));
      set({ leaves: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post<Leave>(
          `${ProjectURL}/api/leaves`,
          leave,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set((state) => ({
          leaves: [...state.leaves, response.data],
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updateLeave: async (id, leave) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.leaves.map((l) =>
        l._id === id ? { ...l, ...leave } : l
      );
      localStorage.setItem(DUMMY_LEAVE_KEY, JSON.stringify(updated));
      set({ leaves: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.put<Leave>(
          `${ProjectURL}/api/leaves/${id}`,
          leave,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        set((state) => ({
          leaves: state.leaves.map((l) =>
            l._id === id ? response.data : l
          ),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deleteLeave: async (id) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.leaves.filter((l) => l._id !== id);
      localStorage.setItem(DUMMY_LEAVE_KEY, JSON.stringify(updated));
      set({ leaves: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`${ProjectURL}/api/leaves/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          leaves: state.leaves.filter((l) => l._id !== id),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useLeaveStore;
