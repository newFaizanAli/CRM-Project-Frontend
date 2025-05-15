import axios from "axios";
import { ProjectURL } from "../utilities/const";
import { toastError } from "../utilities/toastUtils";

interface User {
  // id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

const API_URL = `${ProjectURL}`;

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      const data = response?.data;

      const user: User = {
        // id: data._id,
        name: data.name,
        email: data.email,
      };

      return { user, token: data.token };
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Anything went wrong.";
      toastError(msg);
    }
  },

  async signup(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });
      const data = response?.data;

      const user: User = {
        // id: data._id,
        name: data.name,
        email: data.email,
      };

      return { user, token: data.token };
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Anything went wrong.";
      toastError(msg);
    }
  },

  loginAsDummy(): AuthResponse {
    return {
      token: "123456789",
      user: {
        name: "John Doe",
        email: "john@example.com",
      },
    };
  },

  logout(): void {
    // TODO: Implement actual logout logic
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser(): User | null {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },
};
