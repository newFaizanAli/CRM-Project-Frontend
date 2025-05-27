import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../utilities/const";
import { LeadInput } from "../utilities/types";
import { toastError } from "../utilities/toastUtils";

interface LeadsState {
  leads: LeadInput[];
  isFetched: boolean;

  fetchLeads: () => Promise<void>;
  addLead: (lead: LeadInput) => Promise<void>;
  updateLead: (id: number, contact: Partial<LeadInput>) => Promise<void>;
  deleteLead: (id: number) => Promise<void>;
}

const DUMMY_STORAGE_KEY = "dummy_leads";

const useLeadsStore = create<LeadsState>((set, get) => ({
  leads: [],
  isFetched: false,

  fetchLeads: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const token = localStorage.getItem("token");

    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyLeads: LeadInput[] = stored ? JSON.parse(stored) : [];
      set({ leads: dummyLeads, isFetched: true });
    } else {
      try {
        const response = await axios.get(`${ProjectURL}/api/leads`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const fetchedLeads = response.data;
        set({ leads: fetchedLeads, isFetched: true });
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  addLead: async (lead) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";
    if (isDummy) {
      const state = get();
      const newId = Date.now();
      const newLead: LeadInput = { _id: newId, ...lead };
      const updated = [...state.leads, newLead];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ leads: updated });
    } else {
      try {
        const response = await axios.post(`${ProjectURL}/api/leads`, lead, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const newLead = response.data;

        set((state) => ({
          leads: [...state.leads, newLead],
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updateLead: async (id, lead) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";
    if (isDummy) {
      const state = get();
      const updatedLeads = state.leads.map((c) =>
        c._id === id ? { ...c, ...lead } : c
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updatedLeads));
      set({ leads: updatedLeads });
    } else {
      try {
        await axios.put(`${ProjectURL}/api/leads/${id}`, lead, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        set((state) => ({
          leads: state.leads.map((l) => (l._id === id ? { ...l, ...lead } : l)),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deleteLead: async (id) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";
    if (isDummy) {
      const state = get();
      const updated = state.leads.filter((c) => c._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ leads: updated });
    } else {
      try {
        await axios.delete(`${ProjectURL}/api/leads/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        set((state) => ({
          leads: state.leads.filter((contact) => contact._id !== id),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useLeadsStore;
