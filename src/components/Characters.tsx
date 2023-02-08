import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { FC } from "react";

type Props = {
  chats: any[];
};

const Characters: FC<Props> = ({ chats }) => {
  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
    }).format(new Date(date));
  };

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

        <ul className="mt-6 space-y-4">
          {chats.map((chat) => (
            <li key={chat.chat_id}>
              <Link
                href={`/chat/${chat.chat_id}`}
                className="block w-full p-2 transition border rounded-md hover:border-black"
              >
                <h3 className="font-bold">{chat.ai.name}</h3>
                {/* showing last message if exists */}
                {chat.last_message ? (
                  <div className="text-sm">
                    <p className="truncate">
                      {!chat.last_message.isAI && "You: "}
                      {chat.last_message.content}
                      </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {formatDate(chat.last_message.timestamp)}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm">👋 Say hello!</p>
                )}
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
