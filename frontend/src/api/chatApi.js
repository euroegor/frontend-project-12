import axios from "axios";

import routes from "../routes.js";

const api = axios.create();

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getChannels = () => (
  api
    .get(routes.channelsPath())
    .then((response) => response.data)
);

export const getMessages = () => (
  api
    .get(routes.messagesPath())
    .then((response) => response.data)
);

export const addMessage = (message) => (
  api
    .post(routes.messagesPath(), message)
    .then((response) => response.data)
);

export const addChannel = (name) => (
  api
    .post(routes.channelsPath(), { name })
    .then((response) => response.data)
);

export const renameChannel = ({ id, name }) => (
  api
    .patch(
      routes.channelPath(id),
      { name },
    )
    .then((response) => response.data)
);

export const removeChannel = (id) => (
  api
    .delete(routes.channelPath(id))
    .then((response) => response.data)
);