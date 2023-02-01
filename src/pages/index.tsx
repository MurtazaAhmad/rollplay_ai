import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <Link href="/chat" className="block my-12 text-center text-blue-400">
        Go to chat
      </Link>
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

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  };
}
