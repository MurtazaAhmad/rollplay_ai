import { FC } from "react";
import { GetServerSidePropsContext } from "next";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import ChatContextProvider from "@/context/chatContext";
import Chat from "@/components/Chat";

type Props = {
  messages: Message[];
  chat: ChatRaw;
  buyGift: boolean;
};

const ChatIndex: FC<Props> = ({ messages, chat, buyGift }) => {
  return (
    <main className="bg-fixed bg-black bg-cover bg-girl">
      {/* overlay */}
      <div className="fixed inset-0 bg-black opacity-50 z-[0]"></div>

      <ChatContextProvider initialMessages={messages} initialChat={chat}>
        <Chat />
      </ChatContextProvider>
    </main>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx, {
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  });

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // if there's no session, redirect to auth
  if (!session)
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };

  const { id: chatId } = ctx.query;

  // Getting chatroom
  const { data: chatData } = await supabase
    .from("chats")
    .select()
    .eq("id", chatId)
    .single();

  // if chatroom doesn't exist return to home
  if (!chatData)
    return {
      redirect: {
        destination: "/chat",
        permanent: false,
      },
    };

  // if the user's is not propietary of the chat, return to home
  if (chatData && chatData.user_id !== session.user.id)
    return {
      redirect: {
        destination: "/chat",
        permanent: false,
      },
    };

  // get last 50 messages from chat
  const { data: messages }: { data: Message[] | null } = await supabase
    .from("messages")
    .select()
    .eq("chat_id", chatId)
    .order("timestamp", { ascending: false })
    .limit(50);

  if (!messages) {
    return {
      props: {
        messages: [],
      },
    };
  }

  // get buyGift query
  const { buyGift } = ctx.query;

  return {
    props: {
      chat: chatData,
      messages: messages,
      buyGift: buyGift === "true" ? true : false,
    },
  };
}

export default ChatIndex;
