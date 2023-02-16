import { create } from "zustand";
import produce from "immer";
interface MessageStore {
  messages: Message[];
  setMessages: (newMessages: Message[]) => void;

  isAIAnswering: boolean;
  setIsAIAnswering: (value: boolean) => void;
}

const messagesStore = create<MessageStore>((set) => ({
  messages: [],
  setMessages: (newMessages) =>
    set((state) => ({
      messages: newMessages,
    })),

  isAIAnswering: false,
  setIsAIAnswering: (value) => set({ isAIAnswering: value }),
}));

export default messagesStore;
