import { createStore } from "zustand/vanilla";

const createChatStore = () =>
  createStore((set) => ({
    currentChannelId: null,
    modal: null,

    setCurrentChannelId: (channelId) => {
      set({ currentChannelId: channelId });
    },

    openModal: (type, channelId = null) => {
      set({
        modal: {
          type,
          channelId,
        },
      });
    },

    closeModal: () => {
      set({ modal: null });
    },
  }));

export default createChatStore;