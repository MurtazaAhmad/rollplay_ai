import { FormEvent, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { EnvelopeIcon, KeyIcon } from "@heroicons/react/24/outline";

const SignIn = () => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [logging, setLogging] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLogging(true);

    const toastId = toast.loading("Logging in...");
    const emailRegxp = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);

    // handling empty values
    if (credentials.email === "" || credentials.password === "") {
      toast.error("Please, fill all the fields.", {
        id: toastId,
      });

      setLogging(false);
      return;
    }

    if (!emailRegxp.test(credentials.email)) {
      toast.error("Enter a valid email.", {
        id: toastId,
      });

      setLogging(false);
      return;
    }

    // loggin user
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      toast.error("Email or password incorrect.", {
        id: toastId,
      });

      setLogging(false);
      return;
    }

    toast.success("Logged in", {
      id: toastId,
    });

    setLogging(false);

    // redirect to chat home
    router.replace("/chat");
  };

  return (
    <main className="relative bg-black bg-cover bg-girl">
      {/* overlay */}
      <div className="fixed inset-0 bg-black opacity-50 z-[0]"></div>

      <Navbar />

      <div className="relative z-10 grid h-screen place-items-center">
        <section className="text-white w-[90%] md:max-w-md">
          <h1 className="text-3xl font-bold">Welcome Back</h1>

          <form className="my-8 space-y-4" onSubmit={handleLogin}>
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
                placeholder="Enter your password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full p-4 text-white bg-transparent border-b border-white outline-none"
              />

              <KeyIcon className="absolute w-6 h-6 text-white right-4 top-[30%]" />
            </div>

            <button
              disabled={logging}
              className="!mt-16 w-full px-6 py-4 text-white border-2 rounded-full bg-dark border-main"
            >
              Log In
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default SignIn;
