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
};

interface AuthContextType {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;

  isAIAnswering: boolean;
  setIsAIAnswering: Dispatch<SetStateAction<boolean>>;

  dummy: MutableRefObject<HTMLSpanElement | null> | null;

  autoScroll: () => void;
}

const initial: AuthContextType = {
  messages: [],
  setMessages: () => {},

  isAIAnswering: false,
  setIsAIAnswering: () => {},

  dummy: null,

  autoScroll: () => {},
};

export const ChatContext = createContext<AuthContextType>(initial);

const ChatContextProvider: FC<ContextProps> = ({
  children,
  initialMessages,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isAIAnswering, setIsAIAnswering] = useState<boolean>(false);

  const dummy = useRef<HTMLSpanElement>(null);

  // handling auto scroll
  useEffect(() => {
    autoScroll();
  }, [isAIAnswering]);

  const autoScroll = () => {
    const chatContainer = document.querySelector(
      "#scrollable-chat"
    ) as HTMLDivElement;

    chatContainer!.scrollTop =
      dummy.current!.offsetTop - chatContainer!.offsetTop;

    dummy.current?.scrollIntoView();
  };

  const value = {
    messages,
    setMessages,

    isAIAnswering,
    setIsAIAnswering,

    dummy,
    autoScroll,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContextProvider;
