import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../utilities/const";
import { PurchaseOrder } from "../utilities/types";
import { toastError } from "../utilities/toastUtils";

interface PurchaseOrderState {
  purchaseOrders: PurchaseOrder[];
  isFetched: boolean;
  fetchPurchaseOrders: () => Promise<void>;

  addPurchaseOrder: (order: Omit<PurchaseOrder, "_id">) => Promise<void>;
  updatePurchaseOrder: (
    id: string,
    order: Partial<PurchaseOrder>
  ) => Promise<void>;
  deletePurchaseOrder: (id: string) => void;
}

const DUMMY_STORAGE_KEY = "dummy_purchase_orders";

const usePurchaseOrderStore = create<PurchaseOrderState>((set, get) => ({
  purchaseOrders: [],
  isFetched: false,

  fetchPurchaseOrders: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyOrders: PurchaseOrder[] = stored ? JSON.parse(stored) : [];
      set({ purchaseOrders: dummyOrders, isFetched: true });
    } else {
      try {
        const response = await axios.get(`${ProjectURL}/api/purchase-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set({ purchaseOrders: response.data, isFetched: true });
      } catch (err) {
        console.error("Failed to fetch purchase orders:", err);
      }
    }
  },

  addPurchaseOrder: async (order) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newOrder: PurchaseOrder = { _id: Date.now().toString(), ...order };
      const updated = [...state.purchaseOrders, newOrder];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ purchaseOrders: updated });
    } else {
      try {
        const response = await axios.post(
          `${ProjectURL}/api/purchase-orders`,
          order,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        set((state) => ({
          purchaseOrders: [...state.purchaseOrders, response.data],
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updatePurchaseOrder: async (id, order) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updatedOrders = state.purchaseOrders.map((o) =>
        o._id === id ? { ...o, ...order } : o
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updatedOrders));
      set({ purchaseOrders: updatedOrders });
    } else {
      try {
        const response = await axios.put(
          `${ProjectURL}/api/purchase-orders/${id}`,
          order,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const updatedOrder = response.data;

        set((state) => ({
          purchaseOrders: state.purchaseOrders.map((o) =>
            o._id === id ? updatedOrder : o
          ),
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deletePurchaseOrder: async (id) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.purchaseOrders.filter((o) => o._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ purchaseOrders: updated });
    } else {
      try {
        await axios.delete(`${ProjectURL}/api/purchase-orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set((state) => ({
          purchaseOrders: state.purchaseOrders.filter((o) => o._id !== id),
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default usePurchaseOrderStore;
