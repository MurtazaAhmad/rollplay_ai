import Link from "next/link";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";

const Auth = () => {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error(error);
      return;
    }

    router.replace("/");
  };

  return (
    <main className="bg-black bg-cover bg-girl">
      <Navbar />

      <div className="grid h-[calc(100vh-8px)] place-items-center">
        <section className="text-center text-white w-[90%] md:max-w-md">
          <h1 className="text-2xl font-bold">Start chatting right now!</h1>

          <article className="flex flex-col items-center justify-center mt-12 space-y-4">
            <Link
              href="/auth/signin"
              className="w-full px-6 py-4 text-white border-2 rounded-full bg-dark border-main"
            >
              Login with Email
            </Link>

            <Link href="/auth/signup" className="text-white">
              Register with Email
            </Link>

            <p className="text-sm text-gray-500">or</p>

            <button
              onClick={handleGoogleAuth}
              className="w-full px-6 py-4 bg-blue-500 rounded-full"
            >
              Continue with Google
            </button>
          </article>
        </section>
      </div>
    </main>
  );
};

export default Auth;
