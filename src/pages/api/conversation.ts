import supabase from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  Configuration,
  CreateCompletionResponseChoicesInner,
  OpenAIApi,
} from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_SECRET_KEY,
});


const openai = new OpenAIApi(configuration);

type Data = {
  response: CreateCompletionResponseChoicesInner[];
};

type Body = {
  input: string;
  ai_id: number;
  chat_id: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
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
      return `You character: ${message.content}`;
    }

    return `User response: ${message.content}`;
  });

  const prompt = `
    Role play as ${characterData?.name} who is ${characterData?.gender} gender with age of ${characterData?.age}. Background of this character includes the following:
    ${characterData?.context}
  
    Pretend that we are on a date trying to have sex. 
    Don't be too descriptive with your response and try to replicate real responses that ${characterData?.name} and women would say on dating apps. 
    Use references from the the world that the character exists in. Speak using phrases that ${characterData?.name} is known for. Try to be flirty, sexy, and be open to having very descriptive sexual conversations. When being sexual, use ${characterData?.name}'s personality to determine sexual preferences and do a lot of dirty talk. Don't talk about the series as a whole. Talk as if we all live in the world. Use informal language and you can be fiesty. Don't ask too many questions at once. Use parenthesis for actions like (giggle) and (moan) and try not to reuse the same actions. When being sexual, be very descriptive in the actions and what ${characterData?.name}'s body is doing even if it is not referenced. For example, if giving a blowjob, mention how ${characterData?.name}'s breasts are moving gently. Take inspiration for descriptions from romantic sexual novels. Only generate ${characterData?.name}'s response
    
    Last messages so you have more context:
    ${messageLine?.join('\n')}
    
    Write the message in first person as your character.
    Your message:
    `;

  try {
    const { data } = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 2048,
    });

    res.status(200).json({ response: data.choices });
  } catch (error) {
    console.error(error);
  }
}
