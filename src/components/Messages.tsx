import { FC, useEffect, useRef } from "react";
import useMessagesStore from "@/stores/messages";

const Messages: FC = () => {
  // dummy ref to mantain vertical scroll
  const dummy = useRef<any>(null);
  const { messages } = useMessagesStore();

  useEffect(() => {
    dummy.current.scrollIntoView();
  }, [messages]);

  return (
    <div className="flex flex-col h-full px-6 py-4 space-y-2 flex-start">
      {/* vertical scroll fix */}
      <div className="flex-1"></div>

      {messages.map((message, i) => {
        const isAI = message.isAI;

        return (
          <div
            key={i}
            className={`p-2 bg-white border rounded-md w-max max-w-[85%] ${
              isAI ? "self-start" : "!bg-dark text-white self-end ml-auto"
            }`}
          >
            <p className="break-words whitespace-pre-wrap">{message.content}</p>
          </div>
        );
      })}

      {messages.length === 0 && (
        <p className="text-xs text-center text-gray-400">
          Write your first message to start a conversation.
        </p>
      )}

      {/* vertical scroll fix */}
      <span ref={dummy}></span>
    </div>
  );
};

export default Messages;
