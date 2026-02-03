import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    try {
      toast.loading("Logging in...");
      const response = await api.post("/auth/login", { username, password });
      toast.dismiss();
      toast.success("Login successful!");
      return response.data;
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    }
  },
  register: async (
    username: string,
    password: string,
    role: string,
    name: string,
  ) => {
    try {
      toast.loading("Creating account...");
      const response = await api.post("/auth/register", {
        username,
        password,
        role,
        name,
      });
      toast.dismiss();
      toast.success("Account created successfully!");
      return response.data;
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Registration failed");
      throw error;
    }
  },
};

// Bookings API
export const bookingsAPI = {
  create: async (bookingData: any) => {
    try {
      toast.loading("Creating booking...");
      const response = await api.post("/bookings", bookingData);
      toast.dismiss();
      toast.success("Booking created successfully!");
      return response.data;
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed to create booking");
      throw error;
    }
  },
  getAll: async (filters?: any) => {
    try {
      toast.loading("Loading bookings...");
      const response = await api.get("/bookings", { params: filters });
      toast.dismiss();
      toast.success("Bookings loaded successfully!");
      return response.data;
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed to load bookings");
      throw error;
    }
  },
  getById: async (id: number) => {
    try {
      toast.loading("Loading booking details...");
      const response = await api.get(`/bookings/${id}`);
      toast.dismiss();
      toast.success("Booking details loaded!");
      return response.data;
    } catch (error: any) {
      toast.dismiss();
      toast.error(
        error.response?.data?.message || "Failed to load booking details",
      );
      throw error;
    }
  },
  updateStatus: async (id: number, status: string) => {
    try {
      toast.loading("Updating booking status...");
      const response = await api.patch(`/bookings/${id}/status`, { status });
      toast.dismiss();
      toast.success("Booking status updated!");
      return response.data;
    } catch (error: any) {
      toast.dismiss();
      toast.error(
        error.response?.data?.message || "Failed to update booking status",
      );
      throw error;
    }
  },
  getRevenueSummary: async (filters?: any) => {
    try {
      toast.loading("Loading revenue summary...");
      const response = await api.get("/bookings/revenue/summary", {
        params: filters,
      });
      toast.dismiss();
      toast.success("Revenue summary loaded!");
      return response.data;
    } catch (error: any) {
      toast.dismiss();
      toast.error(
        error.response?.data?.message || "Failed to load revenue summary",
      );
      throw error;
    }
  },
};

export default api;
