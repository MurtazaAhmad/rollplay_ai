import { create } from "zustand";
interface MessageStore {
  messages: Message[];
  setMessages: (messages: Message[]) => void;

  isAIAnswering: boolean;
  setIsAIAnswering: (value: boolean) => void;
}

const messagesStore = create<MessageStore>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),

  isAIAnswering: false,
  setIsAIAnswering: (value) => set({ isAIAnswering: value }),
}));

export default messagesStore;
