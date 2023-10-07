import { create } from "zustand"


export const useChatStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  selectedChatId: null,
  setSelectedChatId: (selectedChatId) => set({ selectedChatId }),
  conversations: [],
  setConversations: (conversations) => set({ conversations }),
}))