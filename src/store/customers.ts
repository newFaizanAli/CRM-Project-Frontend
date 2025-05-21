import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../utilities/const";
import { Customer } from "../utilities/types";
import { toastError } from "../utilities/toastUtils";

interface CustomerState {
  customers: Customer[];
  isFetched: boolean;
  fetchCustomers: () => Promise<void>;

  addCustomer: (customer: Omit<Customer, "_id">) => Promise<void>;
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => void;
}

const DUMMY_STORAGE_KEY = "dummy_customers";

const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  isFetched: false,

  fetchCustomers: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";
    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyCustomers: Customer[] = stored ? JSON.parse(stored) : [];
      set({ customers: dummyCustomers, isFetched: true });
    } else {
      try {
        const response = await axios.get(`${ProjectURL}/api/customers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set({ customers: response.data, isFetched: true });
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      }
    }
  },

  addCustomer: async (customer) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newCustomer: Customer = { _id: Date.now().toString(), ...customer };
      const updated = [...state.customers, newCustomer];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ customers: updated });
    } else {
      try {
        const response = await axios.post(`${ProjectURL}/api/customers`, customer, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set((state) => ({
          customers: [...state.customers, response.data],
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updateCustomer: async (id, customer) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updatedCustomers = state.customers.map((c) =>
        c._id === id ? { ...c, ...customer } : c
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updatedCustomers));
      set({ customers: updatedCustomers });
    } else {
      try {
        await axios.put(`${ProjectURL}/api/customers/${id}`, customer, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set((state) => ({
          customers: state.customers.map((c) =>
            c._id === id ? { ...c, ...customer } : c
          ),
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deleteCustomer: async (id) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.customers.filter((c) => c._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ customers: updated });
    } else {
      try {
        await axios.delete(`${ProjectURL}/api/customers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set((state) => ({
          customers: state.customers.filter((c) => c._id !== id),
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useCustomerStore;
