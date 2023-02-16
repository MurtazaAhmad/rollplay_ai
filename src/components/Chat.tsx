import Messages from "@/components/Messages";
import MessageInput from "@/components/MessageInput";

import { FC, useEffect } from "react";
import useChat from "@/hooks/useChat";

const Chat: FC = () => {
  const { messages, setMessages } = useChat();

  return (
    <section className="relative flex flex-col h-[calc(100vh-44px)] md:h-screen">
      {/* chat */}

      {/* chat container */}
      <div
        className="flex flex-col-reverse h-full max-h-full overflow-auto scrollbar"
        id="scrollable-chat"
      >
        <Messages />
      </div>

      {/* chat input */}
      <MessageInput />
    </section>
  );
};

export default Chat;
