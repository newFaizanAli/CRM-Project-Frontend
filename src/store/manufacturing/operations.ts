import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../../utilities/const";
import { Operation } from "../../utilities/types";
import { toastError } from "../../utilities/toastUtils";

interface OperationState {
  operations: Operation[];
  isFetched: boolean;
  fetchOperations: () => Promise<void>;
  addOperation: (operation: Omit<Operation, "_id">) => Promise<void>;
  updateOperation: (id: string, data: Partial<Operation>) => Promise<void>;
  deleteOperation: (id: string) => Promise<void>;
}

const DUMMY_STORAGE_KEY = "dummy_operations";
const BackendURL = `operations`;

const useOperationStore = create<OperationState>((set, get) => ({
  operations: [],
  isFetched: false,

  fetchOperations: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyData: Operation[] = stored ? JSON.parse(stored) : [];
      set({ operations: dummyData, isFetched: true });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get<Operation[]>(
          `${ProjectURL}/api/${BackendURL}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set({ operations: response.data, isFetched: true });
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  addOperation: async (operation) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newItem: Operation = { _id: Date.now().toString(), ...operation };
      const updated = [...state.operations, newItem];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ operations: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post<Operation>(
          `${ProjectURL}/api/${BackendURL}`,
          operation,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set((state) => ({
          operations: [...state.operations, response.data],
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updateOperation: async (id, data) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.operations.map((o) =>
        o._id === id ? { ...o, ...data } : o
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ operations: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.put<Operation>(
          `${ProjectURL}/api/${BackendURL}/${id}`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        set((state) => ({
          operations: state.operations.map((o) =>
            o._id === id ? response.data : o
          ),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deleteOperation: async (id) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.operations.filter((o) => o._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ operations: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`${ProjectURL}/api/${BackendURL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          operations: state.operations.filter((o) => o._id !== id),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useOperationStore;
