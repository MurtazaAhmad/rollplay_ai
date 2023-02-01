import React, { FormEvent, useState } from "react";
import Navbar from "@/components/Navbar";

import { toast } from "react-hot-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/router";

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

  const handleChange = (e) => {
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

    router.push("/");
  };

  return (
    <main>
      <Navbar />

      <section>
        <header className="my-12 text-center">
          <h1 className="text-xl font-bold">Create new character.</h1>
        </header>

        <form
          className="w-[90%] mx-auto space-y-6"
          onSubmit={handleCreateCharacter}
        >
          <label className="block">
            <p className="mb-2">Name</p>
            <input
              type="text"
              className="w-full p-2 bg-gray-100 rounded-md"
              placeholder="Mitsuki"
              value={character.name}
              name="name"
              onChange={handleChange}
            />
          </label>

          <div className="grid grid-cols-2 gap-5">
            <label className="block">
              <p className="mb-2">Age</p>
              <input
                type="number"
                minLength={18}
                className="w-full p-2 bg-gray-100 rounded-md appeareance-none"
                value={character.age}
                name="age"
                onChange={handleChange}
              />
            </label>

            <label className="block">
              <p className="mb-2">Gender</p>
              <select
                className="w-full p-2 bg-gray-100 rounded-md appeareance-none"
                value={character.gender}
                name="gender"
                onChange={handleChange}
              >
                <option value="Not Specified">Not Specified</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </label>
          </div>

          <label className="block">
            <p className="mb-2">Description (context)</p>
            <textarea
              className="w-full p-2 bg-gray-100 rounded-md appeareance-none min-h-[200px] resize-none"
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

export default NewCharacter;
