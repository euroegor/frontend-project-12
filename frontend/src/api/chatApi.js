import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getChannels = () => (
  api.get("/channels").then((response) => response.data)
);

export const getMessages = () => (
  api.get("/messages").then((response) => response.data)
);

export const addMessage = (message) => (
  api.post("/messages", message).then((response) => response.data)
);