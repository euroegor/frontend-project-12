import { create } from "zustand";

const useChatStore = create((set) => ({
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

export default useChatStore;