import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../utilities/const";
import { Product } from "../utilities/types";
import { toastError } from "../utilities/toastUtils";

interface ProductsState {
  products: Product[];
  isFetched: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, "_id">) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const DUMMY_STORAGE_KEY = "dummy_products";

const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  isFetched: false,

  fetchProducts: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyProducts: Product[] = stored ? JSON.parse(stored) : [];
      set({ products: dummyProducts, isFetched: true });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get<Product[]>(
          `${ProjectURL}/api/products`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set({ products: response.data, isFetched: true });
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  addProduct: async (product) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newProduct: Product = { _id: Date.now().toString(), ...product };
      const updated = [...state.products, newProduct];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ products: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post<Product>(
          `${ProjectURL}/api/products`,
          product,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set((state) => ({
          products: [...state.products, response.data],
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updateProduct: async (id, product) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    const { ...safeProduct } = product;

    if (isDummy) {
      const state = get();
      const updatedProducts = state.products.map((p) =>
        p._id === id ? { ...p, ...safeProduct } : p
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updatedProducts));
      set({ products: updatedProducts });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.put<Product>(
          `${ProjectURL}/api/products/${id}`,
          safeProduct,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        set((state) => ({
          products: state.products.map((p) =>
            p._id === id ? response.data : p
          ),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deleteProduct: async (id) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.products.filter((p) => p._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ products: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`${ProjectURL}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          products: state.products.filter((p) => p._id !== id),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useProductsStore;
