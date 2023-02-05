import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import Navbar from "@/components/Navbar";
import Characters from "@/components/Characters";

type Props = {
  chats: any[];
};

export default function Home({ chats }: Props) {
  return (
    <main className="min-h-screen">
      <Navbar />

      <Characters chats={chats} />
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

    return {
      ai,
      chat_id: data.id,
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
