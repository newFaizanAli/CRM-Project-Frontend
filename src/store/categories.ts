import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../utilities/const";
import { Category } from "../utilities/types";
import { toastError } from "../utilities/toastUtils";

interface CategoriesState {
  categories: Category[];
  isFetched: boolean;
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, "_id">) => Promise<void>;
  updateCategory: (id: number, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
}

const DUMMY_STORAGE_KEY = "dummy_categories";

const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: [],
  isFetched: false,

  fetchCategories: async () => {
    const state = get();
    if (state.isFetched) return;

    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyCategories: Category[] = stored ? JSON.parse(stored) : [];
      set({ categories: dummyCategories, isFetched: true });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get<Category[]>(
          `${ProjectURL}/api/categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set({ categories: response.data, isFetched: true });
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
  },

  addCategory: async (category) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newId = Date.now(); // generate a unique ID
      const newCategory: Category = { _id: newId, ...category };
      const updated = [...state.categories, newCategory];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ categories: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post<Category>(
          `${ProjectURL}/api/categories`,
          category,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        

        set((state) => ({
          categories: [...state.categories, response.data],
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updateCategory: async (id, category) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    // Make a copy without _id
    const { ...safeCategory } = category;

    if (isDummy) {
      const state = get();
      const updatedCategories = state.categories.map((c) =>
        c._id === id ? { ...c, ...safeCategory } : c
      );
      localStorage.setItem(
        DUMMY_STORAGE_KEY,
        JSON.stringify(updatedCategories)
      );
      set({ categories: updatedCategories });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.put<Category>(
          `${ProjectURL}/api/categories/${id}`,
          safeCategory, // use safeCategory instead of full category
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        set((state) => ({
          categories: state.categories.map((c) =>
            c._id === id ? response.data : c
          ),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deleteCategory: async (id) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.categories.filter((c) => c._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ categories: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`${ProjectURL}/api/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          categories: state.categories.filter((c) => c._id !== id),
        }));
      } catch (error) {
         const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useCategoriesStore;
