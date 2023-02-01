import { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

import useMessagesStore from "@/stores/messages";

const MessageInput = () => {
  const [message, setMessage] = useState("");

  const { messages, setMessages } = useMessagesStore();

  const sendMessage = () => {
    if (message === "") return;

    const newMessage = {
      author: "me",
      content: message,
      timestamp: new Date(),
      isAI: false,
    };

    setMessages([...messages, newMessage]);
    setMessage("");
  };

  return (
    <div className="flex items-center px-6 bg-dark">
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
        className="flex-1 py-4 text-white bg-transparent outline-none"
      />

      <button
        onClick={sendMessage}
        disabled={!message}
        className="disabled:opacity-5F0"
      >
        <PaperAirplaneIcon className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};

export default MessageInput;
