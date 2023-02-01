import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { FC } from "react";

type Props = {
  chats: any[];
};

const Characters: FC<Props> = ({ chats }) => {
  return (
    <section className="px-4 my-12">
      <article>
        <Link
          href="/new/character"
          className="flex items-center justify-center w-full py-6 transition border rounded-md hover:shadow-md hover:-translate-y-1"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          <p>New Character</p>
        </Link>
      </article>

      <article className="my-12">
        <header>
          <h3 className="font-bold">Chatrooms</h3>
        </header>

        <ul className="mt-6">
          {chats.map((chat) => (
            <li key={chat.chat_id}>
              <Link
                href={`/chat/${chat.chat_id}`}
                className="block w-full p-2 transition border rounded-md hover:border-black"
              >
                <h3 className="font-bold">{chat.ai.name}</h3>
                <p className="text-sm">👋 Say hello!</p>
              </Link>
            </li>
          ))}

          {chats.length === 0 && <li>There are no chatrooms yet...</li>}
        </ul>
      </article>
    </section>
  );
};

export default Characters;
