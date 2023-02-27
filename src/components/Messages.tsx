import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
import { Popover } from "@headlessui/react";

import { v4 as uuid } from "uuid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { ChevronLeftIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

import orderChatsByDate from "@/utils/orderChatsByDate";
import LoadingDots from "@/ui/LoadingDots";
import useChat from "@/hooks/useChat";

const Messages: FC = () => {
  // dummy ref to mantain vertical scroll
  const { messages, isAIAnswering, setMessages, dummy, chat } = useChat();
  const supabase = useSupabaseClient();
  const { query, back } = useRouter();

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

  const goBack = () => {
    back();
  };

  const checkIfDateIsToday = (date: string) => {
    const today = new Date();
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

    if (!newMessages) return;

    // adding new messages
    setMessages([...newMessages, ...messages]);
  };

  const deleteChat = async () => {
    // deleting messages and character
    const res = [
      await supabase.from("messages").delete().eq("chat_id", chat?.id).select('*'),
      await supabase.from("chats").delete().eq("id", chat?.id).select('*'),
      await supabase.from("characters").delete().eq("id", chat?.ai_id).select('*'),
    ];

    if (res.some((r) => r.status)) return console.log(res);

    goBack();
  };

  return (
    <div className="relative px-6 py-4 ">
      <header className="fixed z-50 flex items-center justify-between left-5 top-5 right-5">
        {/* back button */}
        <button
          onClick={goBack}
          className="p-1 rounded-md bg-main/50 backdrop-blur-sm"
        >
          <ChevronLeftIcon className="w-5 h-5 text-white" />
        </button>

        {/* settings chat (delete) */}
        <Popover className="relative inline-flex">
          <Popover.Button>
            <Cog6ToothIcon className="w-5 h-5 text-white" />
          </Popover.Button>

          <Popover.Panel className="absolute right-0 z-50 w-48 mt-4 origin-top-right rounded-md shadow-lg bg-dark top-full focus:outline-none">
            <div className="p-2">
              <h3 className="text-white">Settings</h3>

              <button
                onClick={deleteChat}
                className="block w-full px-4 py-2 mt-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              >
                Delete chat
              </button>
            </div>
          </Popover.Panel>
        </Popover>
      </header>

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
                  .map((message: Message) => {
                    const isAI = message.isAI;
                    const fallbackId = uuid();

                    return (
                      <div
                        key={message.id || fallbackId}
                        className={`p-2 bg-dark text-white rounded-md rounded-tl-none w-max max-w-[85%] ${
                          isAI
                            ? "self-start"
                            : "!bg-main text-dark self-end ml-auto !rounded-md !rounded-tr-none"
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
          className={`p-4 bg-dark text-white rounded-md rounded-tl-none w-max max-w-[85%] self-start flex items-center space-x-1`}
        >
          <div className="w-1.5 bg-main rounded-full aspect-square animate-bounce"></div>
          <div className="w-1.5 delay-100 bg-main rounded-full aspect-square animate-bounce"></div>
          <div className="w-1.5 delay-200 bg-main rounded-full aspect-square animate-bounce"></div>
        </div>
      )}

      {/* vertical scroll fix */}
      <span ref={dummy} className="block h-14"></span>

      {messages.length === 0 && (
        <p className="text-xs text-center text-gray-400">
          Write your first message to start a conversation.
        </p>
      )}
    </div>
  );
};

export default Messages;
