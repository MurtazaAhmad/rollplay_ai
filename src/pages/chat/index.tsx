import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import Navbar from "@/components/Navbar";
import Characters from "@/components/Characters";

type Props = {
  chats: any[];
};

export default function ChatHome({ chats }: Props) {
  return (
    <main className="bg-fixed bg-black bg-cover bg-girl">
      <Navbar />

      <div className="min-h-[calc(100vh-8px)] overflow-y-auto" >
        <Characters chats={chats} />
      </div>
    </main>
  );
}

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

  // Getting chatrooms
  const { data: chatData } = await supabase
    .from("chats")
    .select()
    .order("created_at", { ascending: false })
    .eq("user_id", session.user.id);

  const res = chatData?.map(async (data) => {
    const { data: ai } = await supabase
      .from("characters")
      .select()
      .limit(1)
      .eq("id", data.ai_id)
      .single();

    // get last message from chat
    const { data: message }: { data: Message | null } = await supabase
      .from("messages")
      .select()
      .limit(1)
      .eq("chat_id", data.id)
      .order("timestamp", { ascending: false })
      .single();

    const { count } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("chat_id", data.id);

    return {
      ai,
      chat_id: data.id,
      last_message: message,
      messages_count: count,
    };
  });

  const chats = await Promise.all(res as []);

  return {
    props: {
      initialSession: session,
      user: session.user,
      chats,
    },
  };
}
