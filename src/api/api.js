import axios from "axios";
import { getApiBaseUrl } from "../config/network";

const API_URL = getApiBaseUrl();

export const signup = async (name, email, password, role) => {
  const res = await axios.post(`${API_URL}/auth/signup`, { name, email, password, role });
  return res.data;
};

export const login = async (email, password) => {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password });
  return res.data;
};
