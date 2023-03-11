import Messages from "@/components/Messages";
import MessageInput from "@/components/MessageInput";

import { FC } from "react";

const Chat: FC = () => {
  return (
    <section className="relative z-10 flex flex-col min-h-screen md:h-screen">
      {/* chat */}

      {/* chat container */}
      <div
        className="flex flex-col-reverse h-full max-h-full overflow-auto scrollbar overflow-scroll-none"
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
