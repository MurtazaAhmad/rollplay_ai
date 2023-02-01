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

            {message.timestamp && (
              <p className="text-sm text-gray-500">
                {new Intl.DateTimeFormat("en-EN", {
                  timeStyle: "short",
                }).format(message.timestamp)}
              </p>
            )}
          </div>
        );
      })}

      {/* vertical scroll fix */}
      <span ref={dummy}></span>
    </div>
  );
};

export default Messages;
