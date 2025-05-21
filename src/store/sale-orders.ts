import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../utilities/const";
import { toastError } from "../utilities/toastUtils";
import { SaleOrder } from "../utilities/types"; 

interface SaleOrderState {
  saleOrders: SaleOrder[];
  isFetched: boolean;
  fetchSaleOrders: () => Promise<void>;

  addSaleOrder: (order: Omit<SaleOrder, "_id">) => Promise<void>;
  updateSaleOrder: (
    id: string,
    order: Partial<SaleOrder>
  ) => Promise<void>;
  deleteSaleOrder: (id: string) => void;
}

const DUMMY_STORAGE_KEY = "dummy_sale_orders";

const useSaleOrderStore = create<SaleOrderState>((set, get) => ({
  saleOrders: [],
  isFetched: false,

  fetchSaleOrders: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyOrders: SaleOrder[] = stored ? JSON.parse(stored) : [];
      set({ saleOrders: dummyOrders, isFetched: true });
    } else {
      try {
        const response = await axios.get(`${ProjectURL}/api/sale-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set({ saleOrders: response.data, isFetched: true });
      } catch (err) {
        console.error("Failed to fetch sale orders:", err);
      }
    }
  },

  addSaleOrder: async (order) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newOrder: SaleOrder = { _id: Date.now().toString(), ...order };
      const updated = [...state.saleOrders, newOrder];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ saleOrders: updated });
    } else {
      try {
        const response = await axios.post(
          `${ProjectURL}/api/sale-orders`,
          order,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        set((state) => ({
          saleOrders: [...state.saleOrders, response.data],
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updateSaleOrder: async (id, order) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updatedOrders = state.saleOrders.map((o) =>
        o._id === id ? { ...o, ...order } : o
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updatedOrders));
      set({ saleOrders: updatedOrders });
    } else {
      try {
        const response = await axios.put(
          `${ProjectURL}/api/sale-orders/${id}`,
          order,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const updatedOrder = response.data;

        set((state) => ({
          saleOrders: state.saleOrders.map((o) =>
            o._id === id ? updatedOrder : o
          ),
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deleteSaleOrder: async (id) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.saleOrders.filter((o) => o._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ saleOrders: updated });
    } else {
      try {
        await axios.delete(`${ProjectURL}/api/sale-orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set((state) => ({
          saleOrders: state.saleOrders.filter((o) => o._id !== id),
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useSaleOrderStore
