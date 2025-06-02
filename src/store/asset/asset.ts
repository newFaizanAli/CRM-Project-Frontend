import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../../utilities/const";
import { Asset } from "../../utilities/types"; // ✅ Make sure this type exists
import { toastError } from "../../utilities/toastUtils";

interface AssetState {
  assets: Asset[];
  isFetched: boolean;
  fetchAssets: () => Promise<void>;
  addAsset: (data: Omit<Asset, "_id">) => Promise<void>;
  updateAsset: (id: string, data: Partial<Asset>) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
}

const DUMMY_STORAGE_KEY = "dummy_assets";

const useAssetStore = create<AssetState>((set, get) => ({
  assets: [],
  isFetched: false,

  fetchAssets: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyData: Asset[] = stored ? JSON.parse(stored) : [];
      set({ assets: dummyData, isFetched: true });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get<Asset[]>(
          `${ProjectURL}/api/assets`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set({ assets: response.data, isFetched: true });
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  addAsset: async (data) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newItem: Asset = { _id: Date.now().toString(), ...data };
      const updated = [...state.assets, newItem];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ assets: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post<Asset>(
          `${ProjectURL}/api/assets`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set((state) => ({
          assets: [...state.assets, response.data],
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updateAsset: async (id, data) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updatedItems = state.assets.map((item) =>
        item._id === id ? { ...item, ...data } : item
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updatedItems));
      set({ assets: updatedItems });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.put<Asset>(
          `${ProjectURL}/api/assets/${id}`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        set((state) => ({
          assets: state.assets.map((item) =>
            item._id === id ? response.data : item
          ),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deleteAsset: async (id) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.assets.filter((item) => item._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ assets: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`${ProjectURL}/api/assets/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          assets: state.assets.filter((item) => item._id !== id),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useAssetStore;
