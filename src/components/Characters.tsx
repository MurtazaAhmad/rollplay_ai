import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { FC } from "react";

type Props = {
  chats: Chat[];
};

const Characters: FC<Props> = ({ chats }) => {
  const formatDate = (date: string) => {
    const dateToFormat = new Date(date).getDate() - new Date().getDate();

    return new Intl.RelativeTimeFormat("en-US", {
      numeric: "auto",
    }).format(dateToFormat, "day");
  };

  return (
    <section className="px-4 mt-32">
      <article>
        <Link
          href="/new/character"
          className="flex items-center justify-center w-full py-6 text-white transition border-2 rounded-md bg-dark border-main hover:shadow-md hover:-translate-y-1"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          <p>New Character</p>
        </Link>
      </article>

      <article className="my-12">
        <header>
          <h3 className="text-xl font-bold text-white md:text-2xl">My chats</h3>
        </header>

        <ul className="mt-6 space-y-4">
          {chats.map((chat) => (
            <li key={chat.chat_id}>
              <Link
                href={`/chat/${chat.chat_id}`}
                className="flex items-center justify-between w-full p-4 text-white transition rounded-2xl bg-main/20 hover:bg-main/50"
              >
                <div>
                  <h3 className="font-bold">{chat.ai.name}</h3>

                  {/* showing last message if exists */}
                  {chat.last_message ? (
                    <p className="text-sm">
                      Last message:
                      <span className="text-main">
                        {" "}
                        {formatDate(chat.last_message.timestamp!)}
                      </span>
                    </p>
                  ) : (
                    <p className="text-sm">👋 Say hello!</p>
                  )}
                </div>

                <div className="relative px-6 py-1 bg-white rounded-full text-dark">
                  <p>{chat.messages_count}</p>
                  <div className="absolute w-2 h-2 transform rotate-45 bg-white"></div>
                </div>
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
