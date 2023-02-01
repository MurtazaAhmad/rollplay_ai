import { FormEvent, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

const SignUp = () => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [registering, setRegistering] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setRegistering(true);

    const toastId = toast.loading("Registering user...");

    // registering usere
    const { error } = await supabaseClient.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: { data: { name: credentials.name } },
    });

    if (error) {
      toast.error(error.message, {
        id: toastId,
      });

      return;
    }

    toast.success("Registered", {
      id: toastId,
    });

    setRegistering(false);
    // redirect to home
    router.replace("/");
  };

  return (
    <main className="grid h-screen bg-dark place-items-center">
      <section className="text-center text-white w-[90%] md:max-w-md">
        <h1 className="text-3xl font-bold">Create an account</h1>

        <form className="my-8 space-y-4" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Enter your name..."
            name="name"
            value={credentials.name}
            onChange={handleChange}
            className="w-full px-4 py-2 text-white rounded-full outline-none bg-slate-800"
          />

          <input
            type="email"
            placeholder="Enter your email..."
            name="email"
            value={credentials.email}
            onChange={handleChange}
            className="w-full px-4 py-2 text-white rounded-full outline-none bg-slate-800"
          />

          <input
            type="password"
            placeholder="Enter your password..."
            name="password"
            value={credentials.password}
            onChange={handleChange}
            className="w-full px-4 py-2 text-white rounded-full outline-none bg-slate-800"
          />

          <button
            disabled={registering}
            className="w-full px-6 py-2 !mt-6 bg-white rounded-full text-dark disabled:opacity-50"
          >
            Sign Up
          </button>
        </form>
      </section>
    </main>
  );
};

export default SignUp;
