import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../../utilities/const";
import { AssetCategory } from "../../utilities/types"; // Make sure this type exists
import { toastError } from "../../utilities/toastUtils";

interface AssetCategoryState {
  assetCategories: AssetCategory[];
  isFetched: boolean;
  fetchAssetCategories: () => Promise<void>;
  addAssetCategory: (data: Omit<AssetCategory, "_id">) => Promise<void>;
  updateAssetCategory: (id: string, data: Partial<AssetCategory>) => Promise<void>;
  deleteAssetCategory: (id: string) => Promise<void>;
}

const DUMMY_STORAGE_KEY = "dummy_asset_categories";

const useAssetCategoryStore = create<AssetCategoryState>((set, get) => ({
  assetCategories: [],
  isFetched: false,

  fetchAssetCategories: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyData: AssetCategory[] = stored ? JSON.parse(stored) : [];
      set({ assetCategories: dummyData, isFetched: true });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get<AssetCategory[]>(
          `${ProjectURL}/api/asset-categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set({ assetCategories: response.data, isFetched: true });
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  addAssetCategory: async (data) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newItem: AssetCategory = { _id: Date.now().toString(), ...data };
      const updated = [...state.assetCategories, newItem];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ assetCategories: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post<AssetCategory>(
          `${ProjectURL}/api/asset-categories`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set((state) => ({
          assetCategories: [...state.assetCategories, response.data],
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updateAssetCategory: async (id, data) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updatedItems = state.assetCategories.map((item) =>
        item._id === id ? { ...item, ...data } : item
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updatedItems));
      set({ assetCategories: updatedItems });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.put<AssetCategory>(
          `${ProjectURL}/api/asset-categories/${id}`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        set((state) => ({
          assetCategories: state.assetCategories.map((item) =>
            item._id === id ? response.data : item
          ),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deleteAssetCategory: async (id) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.assetCategories.filter((item) => item._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ assetCategories: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`${ProjectURL}/api/asset-categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          assetCategories: state.assetCategories.filter((item) => item._id !== id),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useAssetCategoryStore;
