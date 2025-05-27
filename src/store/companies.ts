import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../utilities/const";
import { Company } from "../utilities/types"; 
import { toastError } from "../utilities/toastUtils";

interface CompaniesState {
  companies: Company[];
  isFetched: boolean;
  fetchCompanies: () => Promise<void>;
  addCompany: (company: Omit<Company, "_id">) => Promise<void>;
  updateCompany: (id: string, company: Partial<Company>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
}

const DUMMY_STORAGE_KEY = "dummy_companies";

const useCompaniesStore = create<CompaniesState>((set, get) => ({
  companies: [],
  isFetched: false,

  fetchCompanies: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyCompanies: Company[] = stored ? JSON.parse(stored) : [];
      set({ companies: dummyCompanies, isFetched: true });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get<Company[]>(
          `${ProjectURL}/api/companies`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set({ companies: response.data, isFetched: true });
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  addCompany: async (company) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newCompany: Company = { _id: Date.now().toString(), ...company };
      const updated = [...state.companies, newCompany];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ companies: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post<Company>(
          `${ProjectURL}/api/companies`,
          company,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set((state) => ({
          companies: [...state.companies, response.data],
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updateCompany: async (id, company) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";
    const { ...safeCompany } = company;

    if (isDummy) {
      const state = get();
      const updatedCompanies = state.companies.map((c) =>
        c._id === id ? { ...c, ...safeCompany } : c
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updatedCompanies));
      set({ companies: updatedCompanies });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.put<Company>(
          `${ProjectURL}/api/companies/${id}`,
          safeCompany,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        set((state) => ({
          companies: state.companies.map((c) =>
            c._id === id ? response.data : c
          ),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deleteCompany: async (id) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.companies.filter((c) => c._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ companies: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`${ProjectURL}/api/companies/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          companies: state.companies.filter((c) => c._id !== id),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useCompaniesStore;
