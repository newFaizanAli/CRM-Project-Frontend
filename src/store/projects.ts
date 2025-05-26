import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../utilities/const";
import { Project } from "../utilities/types"; // Apna Project type yahan import karo
import { toastError } from "../utilities/toastUtils";

interface ProjectsState {
  projects: Project[];
  isFetched: boolean;
  fetchProjects: () => Promise<void>;
  addProject: (project: Omit<Project, "_id">) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

const DUMMY_PROJECTS_KEY = "dummy_projects";

const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  isFetched: false,

  fetchProjects: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_PROJECTS_KEY);
      const dummyProjects: Project[] = stored ? JSON.parse(stored) : [];
      set({ projects: dummyProjects, isFetched: true });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get<Project[]>(`${ProjectURL}/api/projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        set({ projects: response.data, isFetched: true });
      } catch (error: any) {
        const msg = error?.response?.data?.message || "Failed to fetch projects";
        toastError(msg);
      }
    }
  },

  addProject: async (project) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const newProject: Project = { _id: Date.now().toString(), ...project };
      const updated = [...state.projects, newProject];
      localStorage.setItem(DUMMY_PROJECTS_KEY, JSON.stringify(updated));
      set({ projects: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post<Project>(`${ProjectURL}/api/projects`, project, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        set((state) => ({
          projects: [...state.projects, response.data],
        }));
      } catch (error: any) {
        const msg = error?.response?.data?.message || "Failed to add project";
        toastError(msg);
      }
    }
  },

  updateProject: async (id, project) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";
    const { ...safeProject } = project;

    if (isDummy) {
      const state = get();
      const updatedProjects = state.projects.map((p) =>
        p._id === id ? { ...p, ...safeProject } : p
      );
      localStorage.setItem(DUMMY_PROJECTS_KEY, JSON.stringify(updatedProjects));
      set({ projects: updatedProjects });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.put<Project>(`${ProjectURL}/api/projects/${id}`, safeProject, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          projects: state.projects.map((p) =>
            p._id === id ? response.data : p
          ),
        }));
      } catch (error: any) {
        const msg = error?.response?.data?.message || "Failed to update project";
        toastError(msg);
      }
    }
  },

  deleteProject: async (id) => {
    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const state = get();
      const updated = state.projects.filter((p) => p._id !== id);
      localStorage.setItem(DUMMY_PROJECTS_KEY, JSON.stringify(updated));
      set({ projects: updated });
    } else {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`${ProjectURL}/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          projects: state.projects.filter((p) => p._id !== id),
        }));
      } catch (error: any) {
        const msg = error?.response?.data?.message || "Failed to delete project";
        toastError(msg);
      }
    }
  },
}));

export default useProjectsStore;
