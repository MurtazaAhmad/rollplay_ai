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
    
    -
    Your name: ${characterData?.name}.
    Your gender: ${characterData?.gender}.
    Your age: ${characterData?.age}.
    Context: ${characterData?.context}
    -
    User last message: ${input}
    -
    Important: (Avoid breaklines at the beginning: "/\/n")
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
