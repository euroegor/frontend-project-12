import { create } from "zustand";

const useChatStore = create((set) => ({
  currentChannelId: null,
  modal: null,

  setCurrentChannelId: (channelId) => {
    set({ currentChannelId: channelId });
  },

  openModal: (modal) => {
    set({ modal });
  },

  closeModal: () => {
    set({ modal: null });
  },
}));

export default useChatStore;