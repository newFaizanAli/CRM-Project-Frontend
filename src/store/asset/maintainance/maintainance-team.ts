import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../../../utilities/const";
import { MaintainanceTeam } from "../../../utilities/types"; 
import { toastError } from "../../../utilities/toastUtils";

interface MaintenanceTeamState {
  teams: MaintainanceTeam[];
  isFetched: boolean;
  fetchTeams: () => Promise<void>;
  addTeam: (data: Omit<MaintainanceTeam, "_id">) => Promise<void>;
  updateTeam: (id: string, data: Partial<MaintainanceTeam>) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
}

const DUMMY_STORAGE_KEY = "dummy_maintenance_teams";

const useMaintenanceTeamStore = create<MaintenanceTeamState>((set, get) => ({
  teams: [],
  isFetched: false,

  fetchTeams: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyData: MaintainanceTeam[] = stored ? JSON.parse(stored) : [];
      set({ teams: dummyData, isFetched: true });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get<MaintainanceTeam[]>(
          `${ProjectURL}/api/maintainance_teams`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set({ teams: response.data, isFetched: true });
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  addTeam: async (data) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newItem: MaintainanceTeam = { _id: Date.now().toString(), ...data };
      const updated = [...state.teams, newItem];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ teams: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post<MaintainanceTeam>(
          `${ProjectURL}/api/maintainance_teams`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set((state) => ({
          teams: [...state.teams, response.data],
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updateTeam: async (id, data) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updatedItems = state.teams.map((item) =>
        item._id === id ? { ...item, ...data } : item
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updatedItems));
      set({ teams: updatedItems });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.put<MaintainanceTeam>(
          `${ProjectURL}/api/maintainance_teams/${id}`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        set((state) => ({
          teams: state.teams.map((item) =>
            item._id === id ? response.data : item
          ),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deleteTeam: async (id) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.teams.filter((item) => item._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ teams: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`${ProjectURL}/api/maintainance_teams/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          teams: state.teams.filter((item) => item._id !== id),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useMaintenanceTeamStore;
