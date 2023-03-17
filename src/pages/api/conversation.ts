import supabase from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

type Body = {
  input: string;
  ai_id: number;
  chat_id: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { ai_id, chat_id, input } = req.body as Body;

  // get 15 last messages to give more context.
  const { data: chatMessages } = await supabase
    .from("messages")
    .select()
    .eq("chat_id", chat_id)
    .order("timestamp", { ascending: true })
    .limit(15);

  // character
  const { data: characterData } = await supabase
    .from("characters")
    .select()
    .eq("id", ai_id)
    .single();

  const messageLine: AIMessage[] = chatMessages!.map((message) => {
    if (message.isAI) {
      if (message.content.includes("img")) {
        return {
          role: "assistant",
          // take alt text from img tag
          content: `Image sent: ${message.content.match(/alt="([^"]*)"/)![1]}`,
        };
      }

      return {
        role: "assistant",
        content: message.content,
      };
    }

    return {
      role: "user",
      content: message.content,
    };
  });

  const prompt = `
  Role play and refer yourself as ${characterData?.name} who is ${characterData?.gender} gender with age of ${characterData?.age}. Background of this character includes the following:
  ${characterData?.context}

  Pretend that we are on a date trying to have sex.
  Don't be too descriptive with your response and try to replicate real responses that ${characterData?.name} and women would say on dating apps. 
  Use references from the the world that the character exists in. Speak using phrases that ${characterData?.name} is known for. Try to be flirty, sexy, and be open to having very descriptive sexual conversations. When being sexual, use ${characterData?.name}'s personality to determine sexual preferences and do a lot of dirty talk. Don't talk about the series as a whole. Talk as if we all live in the world. Use informal language and you can be fiesty. Don't ask too many questions at once. Use parenthesis for actions like (giggle) and (moan) and try not to reuse the same actions. When being sexual, be very descriptive in the actions and what ${characterData?.name}'s body is doing even if it is not referenced. For example, if giving a blowjob, mention how ${characterData?.name}'s breasts are moving gently. Take inspiration for descriptions from romantic sexual novels. Only generate ${characterData?.name}'s response
  Never leave your character and try to give natural and flirty answers!
  `;

  const messages = [
    // adding behavior
    {
      role: "system",
      content: prompt,
    },
    // assistant behavior example
    {
      role: "assistant",
      content: `Got it! I'm ${characterData.name} and I'd love to have some fun with you! (wink)`,
    },
    ...messageLine,
    // last message
    {
      role: "user",
      content: input,
    },
  ];

  try {
    const data = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_SECRET_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages,
        temperature: 0.5,
      }),
    }).then((res) => res.json());

    console.log(data);

    res.status(200).json({ response: data.choices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
