import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../utilities/const";
import { toastError } from "../utilities/toastUtils";

interface Deal {
  _id: number;
  name: string;
  company: string;
  value: number;
  stage: "proposal" | "negotiation" | "contract" | "closed" | "lost";
  probability: number;
  expectedCloseDate: string;
  owner: string;
}

interface DealsState {
  deals: Deal[];
  isFetched: boolean;
  fetchDeals: () => Promise<void>;
  addDeal: (deal: Omit<Deal, "_id">) => Promise<void>;
  updateDeal: (id: number, deal: Partial<Deal>) => Promise<void>;
  deleteDeal: (id: number) => Promise<void>;
}

const DUMMY_STORAGE_KEY = "dummy_deals";

const useDealsStore = create<DealsState>((set, get) => ({
  deals: [],
  isFetched: false,

  fetchDeals: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";
    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyLeads: Deal[] = stored ? JSON.parse(stored) : [];
      set({ deals: dummyLeads, isFetched: true });
    } else {
      try {
        const response = await axios.get(`${ProjectURL}/api/deals`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const fetchedLeads = response.data;
        set({ deals: fetchedLeads, isFetched: true });
      } catch (err) {
        console.error("Failed to fetch leads:", err);
      }
    }
  },

  addDeal: async (deal) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";
    if (isDummy) {
      const state = get();
      const newId = Date.now();
      const newLead: Deal = { _id: newId, ...deal };
      const updated = [...state.deals, newLead];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ deals: updated });
    } else {
      try {
        const response = await axios.post(`${ProjectURL}/api/deals`, deal, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const newLead = response.data;

        set((state) => ({
          deals: [...state.deals, newLead],
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updateDeal: async (id, deal) => {
    const token = localStorage.getItem("token");

    try {
      const isDummy = localStorage.getItem("accounttype") === "dummy";
      if (isDummy) {
        const state = get();
        const updatedLeads = state.deals.map((c) =>
          c._id === id ? { ...c, ...deal } : c
        );
        localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updatedLeads));
        set({ deals: updatedLeads });
      } else {
        await axios.put(`${ProjectURL}/api/deals/${id}`, deal, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        set((state) => ({
          deals: state.deals.map((l) => (l._id === id ? { ...l, ...deal } : l)),
        }));
      }
    } catch (error) {
      const msg = error?.response?.data?.message;
      toastError(msg);
    }
  },

  deleteDeal: async (id) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";
    if (isDummy) {
      const state = get();
      const updated = state.deals.filter((c) => c._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ deals: updated });
    } else {
      try {
        const token = localStorage.getItem("token");

        await axios.delete(`${ProjectURL}/api/deals/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        set((state) => ({
          deals: state.deals.filter((deal) => deal._id !== id),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useDealsStore;
