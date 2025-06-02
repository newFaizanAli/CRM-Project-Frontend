import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../../utilities/const";
import { AssetLocation } from "../../utilities/types"; // Make sure this type exists
import { toastError } from "../../utilities/toastUtils";

interface AssetLocationState {
  assetLocations: AssetLocation[];
  isFetched: boolean;
  fetchAssetLocations: () => Promise<void>;
  addAssetLocation: (data: Omit<AssetLocation, "_id">) => Promise<void>;
  updateAssetLocation: (id: string, data: Partial<AssetLocation>) => Promise<void>;
  deleteAssetLocation: (id: string) => Promise<void>;
}

const DUMMY_STORAGE_KEY = "dummy_asset_locations";

const useAssetLocationStore = create<AssetLocationState>((set, get) => ({
  assetLocations: [],
  isFetched: false,

  fetchAssetLocations: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyData: AssetLocation[] = stored ? JSON.parse(stored) : [];
      set({ assetLocations: dummyData, isFetched: true });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get<AssetLocation[]>(
          `${ProjectURL}/api/asset-locations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set({ assetLocations: response.data, isFetched: true });
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  addAssetLocation: async (data) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newItem: AssetLocation = { _id: Date.now().toString(), ...data };
      const updated = [...state.assetLocations, newItem];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ assetLocations: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post<AssetLocation>(
          `${ProjectURL}/api/asset-locations`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set((state) => ({
          assetLocations: [...state.assetLocations, response.data],
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updateAssetLocation: async (id, data) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updatedItems = state.assetLocations.map((item) =>
        item._id === id ? { ...item, ...data } : item
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updatedItems));
      set({ assetLocations: updatedItems });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.put<AssetLocation>(
          `${ProjectURL}/api/asset-locations/${id}`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        set((state) => ({
          assetLocations: state.assetLocations.map((item) =>
            item._id === id ? response.data : item
          ),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deleteAssetLocation: async (id) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.assetLocations.filter((item) => item._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ assetLocations: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`${ProjectURL}/api/asset-locations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          assetLocations: state.assetLocations.filter((item) => item._id !== id),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useAssetLocationStore;
