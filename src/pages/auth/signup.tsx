import { FormEvent, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { EnvelopeIcon, KeyIcon, UserIcon } from "@heroicons/react/24/outline";

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
    const emailRegxp = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);

    // handling empty values
    if (
      credentials.name === "" ||
      credentials.email === "" ||
      credentials.password === ""
    ) {
      toast.error("Please, fill all the fields.", {
        id: toastId,
      });

      setRegistering(false);
      return;
    }

    if (!emailRegxp.test(credentials.email)) {
      toast.error("Enter a valid email.", {
        id: toastId,
      });

      setRegistering(false);
      return;
    }

    // registering user
    const { error } = await supabaseClient.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: { data: { name: credentials.name } },
    });

    if (error) {
      toast.error(error.message, {
        id: toastId,
      });

      setRegistering(false);
      return;
    }

    toast.success("Registered", {
      id: toastId,
    });

    setRegistering(false);
    // redirect to chat home
    router.replace("/chat");
  };

  return (
    <main className="bg-black bg-cover bg-girl">
      <Navbar />

      <div className="grid h-[calc(100vh-8px)] place-items-center">
        <section className="text-white w-[90%] md:max-w-md">
          <h1 className="text-3xl font-bold">Create an account</h1>

          <form className="my-8 space-y-4" onSubmit={handleRegister}>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your name"
                name="name"
                value={credentials.name}
                onChange={handleChange}
                className="w-full p-4 text-white bg-transparent border-b border-white outline-none"
              />

              <UserIcon className="absolute w-6 h-6 text-white right-4 top-[30%]" />
            </div>

            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                className="w-full p-4 text-white bg-transparent border-b border-white outline-none"
              />

              <EnvelopeIcon className="absolute w-6 h-6 text-white right-4 top-[30%]" />
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="Enter your password..."
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full p-4 text-white bg-transparent border-b border-white outline-none"
              />

              <KeyIcon className="absolute w-6 h-6 text-white right-4 top-[30%]" />
            </div>

            <button
              disabled={registering}
              className="!mt-16 w-full px-6 py-2 !mt-6 bg-white rounded-full text-dark disabled:opacity-50"
            >
              Sign Up
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default SignUp;
