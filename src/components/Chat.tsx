import Messages from "@/components/Messages";
import MessageInput from "@/components/MessageInput";

import useMessagesStore from "@/stores/messages";

import useAuth from "@/hooks/useAuth";
import { FC, useEffect } from "react";

type Message = {
  content: string;
  author: string;
  created_at?: Date;
  isAI: boolean;
  id: number;
  chat_id: number;
};

type Props = {
  messages: Message[];
};

const Chat: FC<Props> = ({ messages }) => {
  const { setMessages } = useMessagesStore();

  useEffect(() => {
    setMessages(messages);
  }, []);

  return (
    <section className="flex flex-col h-screen">
      {/* chat container */}
      <div className="h-full max-h-full overflow-y-auto scrollbar">
        <Messages />
      </div>

      {/* chat input */}
      <MessageInput />
    </section>
  );
};

export default Chat;
