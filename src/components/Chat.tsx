import Messages from "@/components/Messages";
import MessageInput from "@/components/MessageInput";

import { FC, useEffect } from "react";
import useMessagesStore from "@/stores/messages";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

type Props = {
  messages: Message[];
};

const Chat: FC<Props> = ({ messages }) => {
  const { setMessages } = useMessagesStore();
  const { back } = useRouter();

  useEffect(() => {
    setMessages(messages);
  }, []);

  const goBack = () => {
    back();
  };

  return (
    <section className="relative flex flex-col h-screen">
      {/* back button */}
      <button
        onClick={goBack}
        className="absolute p-1 rounded-md left-5 top-5 bg-main/50 backdrop-blur-sm"
      >
        <ChevronLeftIcon className="w-5 h-5 text-white" />
      </button>

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
