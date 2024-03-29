import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { FormEvent, useState } from "react";
import Navbar from "@/components/Navbar";

import { toast } from "react-hot-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/router";
import stripe from "@/lib/stripe";

const NewCharacter = () => {
  const { user } = useAuth();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [character, setCharacter] = useState({
    name: "",
    age: 18,
    gender: "Not Specified",
    context: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "age") {
      setCharacter({ ...character, [name]: parseInt(value) });
      return;
    }

    setCharacter({ ...character, [name]: value });
  };

  const handleCreateCharacter = async (e: FormEvent) => {
    e.preventDefault();

    const toastId = toast.loading("Creating character...");

    // handling empty fields
    if (character.name === "" || character.context === "") {
      toast.error("You must fill all the fields", { id: toastId });
      return;
    }

    // handling age
    if (character.age < 18) {
      toast.error("Character must be at least 18 years old.", { id: toastId });
      return;
    }

    // creating character
    const { data, error: characterError } = await supabase
      .from("characters")
      .insert({
        name: character.name,
        context: character.context,
        gender: character.gender,
        age: character.age,
        created_by: user?.id,
      })
      .select();

    if (characterError) {
      toast.error(characterError.message, { id: toastId });
      return;
    }

    // creating chatroom with character
    const { error: chatError } = await supabase.from("chats").insert({
      user_id: user?.id,
      ai_id: data[0]?.id,
    });

    if (chatError) {
      toast.error(chatError.message, { id: toastId });
      return;
    }

    toast.success("Character created", { id: toastId });

    // redirect to chat
    router.push("/chat");
  };

  return (
    <main className="bg-black bg-cover bg-girl">
      {/* overlay */}
      <div className="fixed inset-0 bg-black opacity-50 z-[0]"></div>

      <Navbar />

      <section className="relative z-10">
        <header className="px-6 my-12 text-left">
          <h1 className="text-xl font-bold text-white">
            Create new character to chat.
          </h1>
        </header>

        <form
          className="w-[90%] mx-auto space-y-6 pb-12"
          onSubmit={handleCreateCharacter}
        >
          <label className="block">
            <input
              type="text"
              placeholder="Enter character name"
              name="name"
              value={character.name}
              onChange={handleChange}
              className="w-full p-4 text-white bg-transparent border-b border-white outline-none"
            />
          </label>

          <div className="grid grid-cols-2 gap-5">
            <label className="block">
              <p className="mb-2 text-white">Age</p>
              <input
                type="number"
                minLength={18}
                className="w-full p-4 text-white bg-transparent border-b border-white outline-none"
                value={character.age}
                name="age"
                onChange={handleChange}
              />
            </label>

            <label className="block">
              <p className="mb-2 text-white">Gender</p>
              <select
                className="w-full p-4 text-white bg-transparent border-b border-white outline-none"
                value={character.gender}
                name="gender"
                onChange={handleChange}
              >
                <option value="Not Specified" className="text-black">
                  Not Specified
                </option>
                <option value="Male" className="text-black">
                  Male
                </option>
                <option value="Female" className="text-black">
                  Female
                </option>
              </select>
            </label>
          </div>

          <label className="block">
            <p className="mb-2 text-white">Description (context)</p>
            <textarea
              className="w-full p-4 text-white bg-transparent border-b border-white outline-none min-h-[200px] resize-none"
              placeholder="She comes for planet XYZ..."
              value={character.context}
              name="context"
              onChange={handleChange}
            />
          </label>

          <button className="w-full py-4 text-white rounded-md bg-dark">
            Create
          </button>
        </form>
      </section>
    </main>
  );
};

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

  //  verify subscription in stripe to check if user can create character
  if (session.user.user_metadata.subscription_id) {
    const subscription = await stripe.subscriptions.retrieve(
      session.user.user_metadata.subscription_id
    );

    if (subscription.status === "active") {
      return {
        props: {},
      };
    }
  }

  // if subscription is not active and have one or more character, redirect to subscription page
  const { data: chatData } = await supabase
    .from("chats")
    .select()
    .eq("user_id", session.user.id);

  if (chatData!.length >= 1) {
    return {
      redirect: {
        destination: "/chat?subscription=true",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default NewCharacter;
