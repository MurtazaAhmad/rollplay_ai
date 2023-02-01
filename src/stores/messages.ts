import { create } from "zustand";

type Message = {
  content: string;
  author: string;
  timestamp?: Date;
  isAI: boolean;
};

interface MessageStore {
  messages: Message[];
  setMessages: (messages: Message[]) => void;

  chatHeight: number;
  setChatHeight: (height: number) => void;
}

const messenger: Message[] = [
  {
    author: "me",
    content: "Hello world.",
    timestamp: new Date(Date.now() - 5000),
    isAI: true,
  },
  {
    author: "me",
    content: "Hello asdaskdjaskdasd.",
    timestamp: new Date(Date.now() - 3000),
    isAI: true,
  },
  {
    author: "me",
    content: "ksajdlkasjdlkasdjklasjdskald.",
    timestamp: new Date(Date.now() - 1000),
    isAI: true,
  },
];

const messagesStore = create<MessageStore>((set) => ({
  messages: messenger,
  setMessages: (messages) => set({ messages }),

  chatHeight: 0,
  setChatHeight: (height) => set({ chatHeight: height }),
}));

export default messagesStore;
