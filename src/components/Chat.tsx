import Messages from "@/components/Messages";
import MessageInput from "@/components/MessageInput";

import { FC, useEffect } from "react";
import useChat from "@/hooks/useChat";

const Chat: FC = () => {
  const { messages, setMessages } = useChat();

  return (
    <section className="relative flex flex-col h-screen">
      {/* chat */}

      {/* chat container */}
      <div
        className="flex flex-col-reverse h-full max-h-full overflow-auto scrollbar"
        id="scrollable-chat"
      >
        <Messages />
      </div>

      {/* chat input */}
      <div className="fixed bottom-0 left-0 right-0">
        <MessageInput />
      </div>
    </section>
  );
};

export default Chat;
