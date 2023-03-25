import { useState, useEffect } from "react";
import { PhotoIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";

import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import MessageLimitModal from "@/components/MessageLimitModal";
import BuyGift from "@/components/BuyGift";

import useAuth from "@/hooks/useAuth";
import useChat from "@/hooks/useChat";

const MessageInput = () => {
  const { user } = useAuth();
  const { messages, setMessages, setIsAIAnswering, autoScroll } = useChat();
  const [message, setMessage] = useState("");
  const [character, setCharacter] = useState<Character | null>(null);

  const [messagesLeft, setMessagesLeft] = useState<number>(0);
  const [imagesLeft, setImagesLeft] = useState<number>(0);

  const [showLimitAlert, setShowLimitAlert] = useState<boolean>(false);
  const [paymentSecret, setPaymentSecret] = useState<string>("");

  const supabase = useSupabaseClient();
  const { query } = useRouter();

  useEffect(() => {
    getImage();
  }, []);

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

      // Getting messages limit
      const messages_left = await checkLimit();
      setMessagesLeft(messages_left);

      setCharacter(characterData);
    }

    getData();
  }, []);

  const getImage = async () => {
    const image = await fetch("/api/image/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: "A man is walking down the street",
      }),
    }).then((res) => res.arrayBuffer());

    // array buffer to blob
    const blob = new Blob([image], { type: "image/png" });

    // blob to url
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const checkLimit = async () => {
    // check message limit
    const res = await fetch("/api/limit/checkMessageLimit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user?.id,
      }),
    }).then((res) => res.json());

    return res.messages_left;
  };

  const sendMessage = async () => {
    if (message === "") return;

    // validating messages left if user is not premium
    if (!user?.isPro && messagesLeft <= 0) {
      setShowLimitAlert(true);
      return;
    }

    const newMessage: Message = {
      author: user!.name,
      content: message,
      chat_id: parseInt(query.id as string),
      isAI: false,
      timestamp: new Date().toString(),
    };

    setMessages((prev) => [newMessage, ...prev]);

    // save own message
    await supabase.from("messages").insert({
      content: message,
      chat_id: query.id,
      author: user?.name,
      isAI: false,
    });

    setMessage("");

    // triggering autoscroll
    autoScroll();
    aiResponse();

    if (!user?.isPro) {
      // decrementing messages left
      await fetch("/api/limit/discountMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user?.id,
        }),
      });

      setMessagesLeft((prev) => prev - 1);
    }
  };

  const aiResponse = async () => {
    // ai answer
    setIsAIAnswering(true);

    autoScroll();

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

    // removing all initals whitespaces on text
    const aiText = data.response[0].message.content;

    const aiMessage = {
      author: character?.name || "",
      content: aiText,
      chat_id: parseInt(query.id as string),
      isAI: true,
      timestamp: new Date().toString(),
    };

    setMessages((prev) => [aiMessage, ...prev]);
    setIsAIAnswering(false);

    // saving ai message
    await supabase.from("messages").insert({
      content: aiText,
      chat_id: query.id,
      author: character?.name,
      isAI: true,
    });
  };

  const sendGift = async () => {
    const { paymentClientSecret } = await fetch("/api/gift", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // price in dollars
        price: 5,
      }),
    }).then((res) => res.json());

    setPaymentSecret(paymentClientSecret);
  };

  const getCharacterImage = async () => {
    // validating messages left if user is not premium
    if (!user?.isPro && messagesLeft <= 0) {
      setShowLimitAlert(true);
      return;
    }

    setIsAIAnswering(true);

    const res = await fetch("/api/image/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // get last 20 messages to create context for image
        chat_id: query.id,
        character: {
          name: character?.name,
          description: character?.context,
        },
      }),
    });

    const { image } = await res.json();

    const newMessage: Message = {
      author: character!.name,
      content: `
        <img src="${image}" alt="Character image" class="ai-image" />
      `,
      chat_id: parseInt(query.id as string),
      isAI: true,
      timestamp: new Date().toString(),
    };

    setMessages((prev) => [newMessage, ...prev]);
    autoScroll();

    setIsAIAnswering(false);

    // saving ai message
    await supabase.from("messages").insert({
      content: `<img src="${image}" alt="Character image" class="ai-image" />`,
      chat_id: query.id,
      author: character?.name,
      isAI: true,
    });
  };

  return (
    <div className="flex items-center px-6 space-x-2 bg-black">
      {showLimitAlert && (
        <MessageLimitModal
          isOpen={showLimitAlert}
          setIsOpen={setShowLimitAlert}
        />
      )}

      {paymentSecret && (
        <BuyGift
          options={{
            clientSecret: paymentSecret,
            appearance: {
              theme: "night",
              variables: { colorPrimary: "#FD79A8" },
            },
          }}
          setPaymentSecret={setPaymentSecret}
        />
      )}

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

      <div className="inline-flex items-center space-x-4">
        <button
          onClick={sendMessage}
          disabled={!message}
          className="disabled:opacity-50"
        >
          <PaperAirplaneIcon className="w-5 h-5 text-white" />
        </button>

        <button onClick={getCharacterImage}>
          <PhotoIcon className="w-5 h-5 text-white" />
        </button>

        {/* <button onClick={sendGift}>
          <GiftIcon className="w-5 h-5 text-white" />
        </button> */}
      </div>
    </div>
  );
};

export default MessageInput;
