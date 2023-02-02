import { FC } from "react";
import { GetServerSidePropsContext } from "next";
import Chat from "@/components/Chat";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

type Message = {
  content: string;
  author: string;
  created_at?: Date;
  isAI: boolean;
  id: number;
  chat_id: number;
};

type Props = {
  messages: Message[];
};

const ChatIndex: FC<Props> = ({ messages }) => {
  return (
    <main>
      <Chat messages={messages} />
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

  // if the user's is not propietary of the chat, return to home
  if (chatData && chatData.user_id !== session.user.id)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  // get messages from chat
  const { data: messages }: { data: Message[] | null } = await supabase
    .from("messages")
    .select()
    .eq("chat_id", chatId);

  if (!messages) {
    return {
      props: {
        messages: [],
      },
    };
  }

  return {
    props: {
      messages: messages,
    },
  };
}

export default ChatIndex;
