import { useContext } from "react";
import { useStore } from "zustand";

import ChatStoreContext from "../providers/chatStoreContext.js";

export const useChatStore = (selector) => {
  const store = useContext(ChatStoreContext);

  if (!store) {
    throw new Error("ChatStoreProvider is missing");
  }

  return useStore(store, selector);
};

export const useChatStoreApi = () => {
  const store = useContext(ChatStoreContext);

  if (!store) {
    throw new Error("ChatStoreProvider is missing");
  }

  return store;
};