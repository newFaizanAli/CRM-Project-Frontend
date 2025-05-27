import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../utilities/const";
import { Contact } from "../utilities/types";
import { toastError } from "../utilities/toastUtils";

interface ContactState {
  contacts: Contact[];
  isFetched: boolean;

  fetchContacts: () => Promise<void>;
  addContact: (data: Omit<Contact, "_id">) => Promise<void>;
  updateContact: (id: string, data: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
}

const DUMMY_STORAGE_KEY = "dummy_contacts";

const useContactsStore = create<ContactState>((set, get) => ({
  contacts: [],
  isFetched: false,

  fetchContacts: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyData: Contact[] = stored ? JSON.parse(stored) : [];
      set({ contacts: dummyData, isFetched: true });
    } else {
      try {
        const res = await axios.get(`${ProjectURL}/api/contacts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set({ contacts: res.data, isFetched: true });
      } catch (err) {
        console.error("Failed to fetch contacts:", err);
        toastError("Failed to fetch contacts");
      }
    }
  },

  addContact: async (data) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newData: Contact = { _id: Date.now().toString(), ...data };
      const updated = [...state.contacts, newData];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ contacts: updated });
    } else {
      try {
        const res = await axios.post(`${ProjectURL}/api/contacts`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });

        set((state) => ({
          contacts: [...state.contacts, res.data],
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg || "Failed to add contact");
      }
    }
  },

  updateContact: async (id, data) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.contacts.map((c) =>
        c._id === id ? { ...c, ...data } : c
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ contacts: updated });
    } else {
      try {
        const res = await axios.put(`${ProjectURL}/api/contacts/${id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });

        set((state) => ({
          contacts: state.contacts.map((c) => (c._id === id ? res.data : c)),
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg || "Failed to update contact");
      }
    }
  },

  deleteContact: async (id) => {
    const token = localStorage.getItem("token");
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.contacts.filter((c) => c._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ contacts: updated });
    } else {
      try {
        await axios.delete(`${ProjectURL}/api/contacts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          contacts: state.contacts.filter((c) => c._id !== id),
        }));
      } catch (err) {
        const msg = err?.response?.data?.message;
        toastError(msg || "Failed to delete contact");
      }
    }
  },
}));

export default useContactsStore;
