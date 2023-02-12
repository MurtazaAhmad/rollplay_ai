import { useState, useEffect } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

import useMessagesStore from "@/stores/messages";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const MessageInput = () => {
  const { user } = useAuth();
  const { messages, setMessages, setIsAIAnswering } = useMessagesStore();
  const [message, setMessage] = useState("");
  const [character, setCharacter] = useState<Character | null>(null);

  const [sendingMessage, setSendingMessage] = useState(false);

  const supabase = useSupabaseClient();
  const { query } = useRouter();

  useEffect(() => {
    // getting ai info
    async function getData() {
      // Getting chatroom
      const { data: chatData } = await supabase
        .from("chats")
        .select()
        .eq("id", query.id)
        .single();

      // Getting character
      const { data: characterData } = await supabase
        .from("characters")
        .select()
        .eq("id", chatData.ai_id)
        .single();

      setCharacter(characterData);
    }

    getData();
  }, []);

  const sendMessage = async () => {
    if (message === "") return;
    setSendingMessage(true);

    const newMessage: Message = {
      author: user!.name,
      content: message,
      chat_id: 2,
      isAI: false,
      timestamp: new Date(),
    };

    messages.unshift(newMessage);
    setMessages(messages);

    // save own message
    await supabase.from("messages").insert({
      content: message,
      chat_id: query.id,
      author: user?.name,
      isAI: false,
    });

    setSendingMessage(false);
    setMessage("");

    // ai answer
    setIsAIAnswering(true);

    // sending message to AI
    const data = await fetch("/api/conversation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: message,
        ai_id: character?.id,
        chat_id: query.id,
      }),
    }).then((res) => res.json());

    // retrieving data

    // removing all initals whitespaces on text
    const aiText = data.response[0].text.replace(/^[\s]*(.*)/, "$1");

    const aiMessage = {
      author: character?.name || "",
      content: aiText,
      chat_id: parseInt(query.id as string),
      isAI: true,
      timestamp: new Date(),
    };

    setIsAIAnswering(false);
    setMessages([aiMessage, ...messages]);

    // saving ai message
    await supabase.from("messages").insert({
      content: aiText,
      chat_id: query.id,
      author: character?.name,
      isAI: true,
    });
  };

  return (
    <div className="flex items-center px-6 bg-black/50">
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
        className="flex-1 py-4 text-white bg-transparent outline-none"
      />

      <button
        onClick={sendMessage}
        disabled={!message}
        className="disabled:opacity-50"
      >
        <PaperAirplaneIcon className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};

export default MessageInput;
