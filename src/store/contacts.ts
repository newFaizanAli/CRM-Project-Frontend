import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../utilities/const";
import { toastError } from "../utilities/toastUtils";

interface Contact {
  _id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: "active" | "inactive";
}

interface ContactsState {
  contacts: Contact[];
  isFetched: boolean;
  fetchContacts: () => Promise<void>;
  addContact: (contact: Omit<Contact, "_id">) => void;
  updateContact: (id: number, contact: Partial<Contact>) => void;
  deleteContact: (id: number) => void;
}

const DUMMY_STORAGE_KEY = "dummy_contacts";

const useContactsStore = create<ContactsState>((set, get) => ({
  contacts: [],
  isFetched: false,

  fetchContacts: async () => {
    const state = get();
    if (state.isFetched) return;

    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyContacts: Contact[] = stored ? JSON.parse(stored) : [];
      set({ contacts: dummyContacts, isFetched: true });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${ProjectURL}/api/contacts`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        set({ contacts: response.data, isFetched: true });
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    }
  },

  addContact: async (contact) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newId = Date.now(); // Simple ID generator
      const newContact: Contact = { _id: newId, ...contact };
      const updated = [...state.contacts, newContact];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ contacts: updated });
    } else {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${ProjectURL}/api/contacts`,
          contact,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set((state) => ({
          contacts: [...state.contacts, response.data],
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updateContact: async (id, contact) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updatedContacts = state.contacts.map((c) =>
        c._id === id ? { ...c, ...contact } : c
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updatedContacts));
      set({ contacts: updatedContacts });
    } else {
      try {
        const token = localStorage.getItem("token");
        await axios.put(`${ProjectURL}/api/contacts/${id}`, contact, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          contacts: state.contacts.map((c) =>
            c._id === id ? { ...c, ...contact } : c
          ),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deleteContact: async (id) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.contacts.filter((c) => c._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ contacts: updated });
    } else {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${ProjectURL}/api/contacts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          contacts: state.contacts.filter((c) => c._id !== id),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useContactsStore;
