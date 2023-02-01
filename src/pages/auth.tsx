import Link from "next/link";

const Auth = () => {
  return (
    <main className="grid h-screen bg-dark place-items-center">
      <section className="text-center text-white w-[90%] md:max-w-md">
        <h1 className="text-2xl font-bold">Rollplay.ai</h1>
        <p className="my-4 text-sm">Your Personal AI Friend</p>

        <article className="flex flex-col items-center justify-center mt-12 space-y-4">
          <button className="w-full px-6 py-2 bg-white rounded-full text-dark">
            <Link href="/auth/signin">Continue with Email</Link>
          </button>

          <button className="text-white">
            <Link href="/auth/signup">Create account with Email</Link>
          </button>

          <p className="text-sm text-gray-500">or</p>

          <button className="w-full px-6 py-2 bg-blue-500 rounded-full">
            Continue with Google
          </button>
        </article>
      </section>
    </main>
  );
};

export default Auth;
