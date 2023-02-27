import {
  createContext,
  useEffect,
  useState,
  useRef,
  MutableRefObject,
} from "react";
import type { FC, ReactNode, Dispatch, SetStateAction } from "react";

type ContextProps = {
  children: ReactNode | ReactNode[];
  initialMessages: Message[];
  initialChat: ChatRaw;
};

interface AuthContextType {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;

  chat: ChatRaw | null;
  setChat: Dispatch<SetStateAction<ChatRaw | null>>;

  isAIAnswering: boolean;
  setIsAIAnswering: Dispatch<SetStateAction<boolean>>;

  dummy: MutableRefObject<HTMLSpanElement | null> | null;

  autoScroll: () => void;
}

const initial: AuthContextType = {
  messages: [],
  setMessages: () => {},

  chat: null,
  setChat: () => {},

  isAIAnswering: false,
  setIsAIAnswering: () => {},

  dummy: null,

  autoScroll: () => {},
};

export const ChatContext = createContext<AuthContextType>(initial);

const ChatContextProvider: FC<ContextProps> = ({
  children,
  initialMessages,
  initialChat
}) => {
  const [chat, setChat] = useState<ChatRaw | null>(initialChat);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isAIAnswering, setIsAIAnswering] = useState<boolean>(false);

  const dummy = useRef<HTMLSpanElement>(null);

  // handling auto scroll
  useEffect(() => {
    autoScroll();
  }, [isAIAnswering]);

  const autoScroll = () => {
    dummy.current?.scrollIntoView();
  };

  const value = {
    messages,
    setMessages,

    chat,
    setChat,

    isAIAnswering,
    setIsAIAnswering,

    dummy,
    autoScroll,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContextProvider;
