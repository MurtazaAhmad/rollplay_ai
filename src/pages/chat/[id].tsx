import { FC } from "react";
import { GetServerSidePropsContext } from "next";
import Chat from "@/components/Chat";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

type Props = {
  messages: Message[];
};

const ChatIndex: FC<Props> = ({ messages }) => {
  return (
    <main className="bg-fixed bg-black bg-cover bg-girl">
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

  // if chatroom doesn't exist return to home
  if (!chatData)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  // if the user's is not propietary of the chat, return to home
  if (chatData && chatData.user_id !== session.user.id)
    return {
      redirect: {
        destination: "/",
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

  return {
    props: {
      messages: messages,
    },
  };
}

export default ChatIndex;
