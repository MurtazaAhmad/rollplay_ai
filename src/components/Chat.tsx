import Messages from "@/components/Messages";
import MessageInput from "@/components/MessageInput";

import useAuth from "@/hooks/useAuth";

const Chat = () => {
  const { user } = useAuth();

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
