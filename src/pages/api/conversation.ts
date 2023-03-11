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
  const { ai_id, chat_id } = req.body as Body;

  // get 10 last messages to give more context.
  const { data: messages } = await supabase
    .from("messages")
    .select()
    .eq("chat_id", chat_id)
    .limit(10);

  // character
  const { data: characterData } = await supabase
    .from("characters")
    .select()
    .eq("id", ai_id)
    .single();

  const messageLine = messages?.map((message) => {
    if (message.isAI) {
      return {
        role: `assistant`,
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
    `;

  // adding behavior
  messageLine?.unshift({
    role: "system",
    content: prompt,
  });

  try {
    const data = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_SECRET_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        messages: messageLine,
      }),
    }).then((res) => res.json());

    res.status(200).json({ response: data.choices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
