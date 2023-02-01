import React from "react";

const SignUp = () => {
  return (
    <main className="grid h-screen bg-dark place-items-center">
      <section className="text-center text-white w-[90%] md:max-w-md">
        <h1 className="text-3xl font-bold">Create an account</h1>

        <form className="my-8 space-y-4">
          <input
            type="email"
            placeholder="Enter your email..."
            className="w-full px-4 py-2 text-white rounded-full outline-none bg-slate-800"
          />

          <input
            type="password"
            placeholder="Enter your password..."
            className="w-full px-4 py-2 text-white rounded-full outline-none bg-slate-800"
          />

          <button className="w-full px-6 py-2 !mt-6 bg-white rounded-full text-dark">
            Log In
          </button>
        </form>
      </section>
    </main>
  );
};

export default SignUp;
