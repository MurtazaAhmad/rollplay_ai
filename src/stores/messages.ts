import { create } from "zustand";
interface MessageStore {
  messages: Message[];
  setMessages: (messages: Message[]) => void;

  chatHeight: number;
  setChatHeight: (height: number) => void;

  isAIAnswering: boolean;
  setIsAIAnswering: (value: boolean) => void;
}

const messagesStore = create<MessageStore>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),

  chatHeight: 0,
  setChatHeight: (height) => set({ chatHeight: height }),

  isAIAnswering: false,
  setIsAIAnswering: (value) => set({ isAIAnswering: value }),
}));

export default messagesStore;
