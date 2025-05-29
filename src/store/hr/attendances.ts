import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../../utilities/const";
import { Attendance } from "../../utilities/types"; 
import { toastError } from "../../utilities/toastUtils";

interface AttendanceState {
  attendances: Attendance[];
  isFetched: boolean;
  fetchAttendances: () => Promise<void>;
  addAttendance: (attendance: Omit<Attendance, "_id">) => Promise<void>;
  updateAttendance: (id: string, attendance: Partial<Attendance>) => Promise<void>;
  deleteAttendance: (id: string) => Promise<void>;
}

const DUMMY_STORAGE_KEY = "dummy_attendances";

const useAttendanceStore = create<AttendanceState>((set, get) => ({
  attendances: [],
  isFetched: false,

  fetchAttendances: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummyData: Attendance[] = stored ? JSON.parse(stored) : [];
      set({ attendances: dummyData, isFetched: true });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get<Attendance[]>(
          `${ProjectURL}/api/attendances`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set({ attendances: response.data, isFetched: true });
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  addAttendance: async (attendance) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newAttendance: Attendance = { _id: Date.now().toString(), ...attendance };
      const updated = [...state.attendances, newAttendance];
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ attendances: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post<Attendance>(
          `${ProjectURL}/api/attendances`,
          attendance,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set((state) => ({
          attendances: [...state.attendances, response.data],
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  updateAttendance: async (id, attendance) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.attendances.map((a) =>
        a._id === id ? { ...a, ...attendance } : a
      );
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ attendances: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.put<Attendance>(
          `${ProjectURL}/api/attendances/${id}`,
          attendance,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        set((state) => ({
          attendances: state.attendances.map((a) =>
            a._id === id ? response.data : a
          ),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },

  deleteAttendance: async (id) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.attendances.filter((a) => a._id !== id);
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
      set({ attendances: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`${ProjectURL}/api/attendances/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          attendances: state.attendances.filter((a) => a._id !== id),
        }));
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useAttendanceStore;
