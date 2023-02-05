import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  Configuration,
  CreateCompletionResponseChoicesInner,
  OpenAIApi,
} from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_SECRET_KEY,
});

// admin supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

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

  // get 15 last messages to give more context.
  const { data: messages } = await supabase
    .from("messages")
    .select()
    .eq("chat_id", chat_id)
    .limit(15);

  // character
  const { data: characterData } = await supabase
    .from("characters")
    .select()
    .eq("id", ai_id)
    .single();

  const messageLine = messages?.map((message) => {
    if (message.isAI) {
      return `You: ${message.content}`;
    }

    return `User: ${message.content}`;
  });

  const prompt = `
    You're going to generate a message as a character based on the following context.
    Send the best response based on the last messages context and your description.

    -
    Your name: ${characterData?.name}.
    Your gender: ${characterData?.gender}.
    Your age: ${characterData?.age}.
    Context: ${characterData?.context}
    -
    Last 15 messages of the chat:
    ${messageLine?.join("\n")}
    -
    Don't repeat things that you've said in the last messages.

    Your reponse:
  `;

  try {
    const { data } = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.8,
      max_tokens: 1500,
    });

    res.status(200).json({ response: data.choices });
  } catch (error) {
    console.error(error);
  }
}
