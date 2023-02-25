import { useEffect, useState } from "react";

import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import Navbar from "@/components/Navbar";
import Characters from "@/components/Characters";

import OnboardingModal from "@/components/OnboardingModal";
import useAuth from "@/hooks/useAuth";

type Props = {
  chats: Chat[];
  showSubscription: boolean;
};

export default function ChatHome({ chats, showSubscription }: Props) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { setIsProModalOpen } = useAuth();

  useEffect(() => {
    const isNew = checkIfNewUser();

    if (showSubscription && !isNew) {
      setIsProModalOpen(true);
    }
  }, []);

  const checkIfNewUser = () => {
    // use localstorage to check if user is new
    const isNewUser = Boolean(
      localStorage.getItem("rollplay:has_seen_onboarding")
    );

    if (!isNewUser) {
      localStorage.setItem("rollplay:has_seen_onboarding", "true");
      setShowOnboarding(true);
    }

    return isNewUser;
  };

  return (
    <main className="bg-fixed bg-black bg-cover bg-girl">
      <Navbar />

      <div className="min-h-[calc(100vh-8px)] overflow-y-auto">
        <Characters chats={chats} />
      </div>

      {/* Onboarding modal for new users */}
      {showOnboarding && <OnboardingModal />}
    </main>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx, {
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  });

  // // Check if we have a session
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

  const chats = await Promise.all(res as Promise<Chat>[]);

  return {
    props: {
      initialSession: session,
      user: session.user,
      chats,
      showSubscription: Boolean(ctx.query.subscription),
    },
  };
}
