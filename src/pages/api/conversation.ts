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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_KEY as string
);

const openai = new OpenAIApi(configuration);

type Data = {
  response: CreateCompletionResponseChoicesInner[];
};

type Body = {
  input: string;
  ai_id: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { input, ai_id } = req.body as Body;

  const { data: characterData } = await supabase
    .from("characters")
    .select()
    .eq("id", ai_id)
    .single();

  const prompt = `
    You're going to generate a message as a character based on the following context.
    Your message must not have breaklines at the beggining.
    -
    Your name: ${characterData?.name}.
    Your gender: ${characterData?.gender}.
    Your age: ${characterData?.age}.
    Context: ${characterData?.context}
    -
    User last message: ${input}
    -
    Your response: 
  `;

  try {
    const { data } = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.4,
      max_tokens: 1024,
    });

    res.status(200).json({ response: data.choices });
  } catch (error) {
    console.error(error);
  }
}
