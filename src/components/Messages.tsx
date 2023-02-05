import { FC, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";

import useMessagesStore from "@/stores/messages";
import orderChatsByDate from "@/utils/orderChatsByDate";

import { v4 as uuid } from "uuid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import LoadingDots from "@/ui/LoadingDots";

const Messages: FC = () => {
  // dummy ref to mantain vertical scroll
  const dummy = useRef<any>(null);
  const { messages, isAIAnswering, setMessages } = useMessagesStore();
  const supabase = useSupabaseClient();
  const { query } = useRouter();

  const [countMessages, setCountMessages] = useState(0);

  const orderedMessages = orderChatsByDate(messages);

  // messages count
  useEffect(() => {
    async function getData() {
      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("chat_id", query.id);

      setCountMessages(count || 0);
    }

    getData();
  }, []);

  // handling auto scroll
  useEffect(() => {
    dummy.current.scrollIntoView();
  }, [isAIAnswering]);

  const checkIfDateIsToday = (date: string) => {
    const today = new Date().toLocaleDateString();
    return new Date(date).getDay() === new Date(today).getDay();
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
    }).format(new Date(date));
  };

  // load more messages 50 - 50
  const loadMoreMessages = async () => {
    const { data: newMessages }: { data: Message[] | null } = await supabase
      .from("messages")
      .select()
      .eq("chat_id", query.id)
      .order("timestamp", { ascending: false })
      .range(messages.length, messages.length + 50);

    if (!newMessages) {
      return;
    }

    // adding new messages
    setMessages([...messages, ...newMessages]);
  };

  return (
    <div className="px-6 py-4 ">
      {/* vertical scroll fix */}
      <div className="flex-1"></div>

      <InfiniteScroll
        hasMore={countMessages > messages.length}
        dataLength={messages.length}
        loader={<LoadingDots />}
        next={loadMoreMessages}
        inverse
        style={{ display: "flex", flexDirection: "column-reverse" }}
        scrollableTarget="scrollable-chat"
      >
        {orderedMessages.map((chat, i) => {
          return (
            <div key={i}>
              <header className="my-10 text-sm text-center text-gray-400">
                <h3>
                  {checkIfDateIsToday(chat.date)
                    ? "Today"
                    : formatDate(chat.date)}
                </h3>
              </header>

              <div className="space-y-2">
                {chat.messages
                  .map((message: any) => {
                    const isAI = message.isAI;
                    const fallbackId = uuid();

                    return (
                      <div
                        key={message.id || fallbackId}
                        className={`p-2 bg-white border rounded-md w-max max-w-[85%] ${
                          isAI
                            ? "self-start"
                            : "!bg-dark text-white self-end ml-auto"
                        }`}
                      >
                        <p className="break-words whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                    );
                  })
                  .reverse()}
              </div>
            </div>
          );
        })}
      </InfiniteScroll>

      {/* Answering animation */}
      {isAIAnswering && (
        <div
          className={`px-2 py-4 bg-white border rounded-md w-max max-w-[85%] self-start flex items-center space-x-1`}
        >
          <div className="w-1.5 bg-gray-400 rounded-full aspect-square animate-bounce"></div>
          <div className="w-1.5 delay-100 bg-gray-400 rounded-full aspect-square animate-bounce"></div>
          <div className="w-1.5 delay-200 bg-gray-400 rounded-full aspect-square animate-bounce"></div>
        </div>
      )}

      {messages.length === 0 && (
        <p className="text-xs text-center text-gray-400">
          Write your first message to start a conversation.
        </p>
      )}

      {/* vertical scroll fix */}
      <span ref={dummy} className="pt-4"></span>
    </div>
  );
};

export default Messages;
