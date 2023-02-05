import Messages from "@/components/Messages";
import MessageInput from "@/components/MessageInput";

import { FC, useEffect } from "react";
import useMessagesStore from "@/stores/messages";

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
