import { NextApiRequest, NextApiResponse } from "next";
import getNovelAIToken from "@/utils/getNovelAIToken";
import supabase from "@/lib/supabase";

const API_URL = "https://api.novelai.net";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getNovelAIToken();
  const { chat_id, character } = req.body;

  // get 15 last messages to give more context.
  const { data: chatMessages } = await supabase
    .from("messages")
    .select()
    .eq("chat_id", chat_id)
    .order("timestamp", { ascending: true })
    .limit(15);

  const messageLine: string[] = chatMessages!.map((message: Message) => {
    if (message.isAI) {
      if (message.content.includes("img"))
        return `Image sent: ${message.content.match(/alt="([^"]*)"/)![1]}`;

      return `${character.name}: ${message.content}`;
    }

    return `You: ${message.content}`;
  });

  // generate context of the chat situation based on the last message and character image.
  const prompt = `
    Generate a parrapraph explaining the current situation on the chat based on the last messages,
    keep in mind the charact description to enchance the context. Be descriptive with visual details to generate an image.
    --
    Last messages: ${messageLine.join("\n")}
    Character: ${character.name}
    Description: ${character.description}
  `;

  // use text-davinci-003 model from openai
  const data = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_SECRET_KEY}`,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt,
      temperature: 0.5,
      max_tokens: 2000,
    }),
  }).then((res) => res.json());

  const imageContext = data.choices[0].text;

  try {
    const response = await fetch(`${API_URL}/ai/generate-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        input: imageContext,
        model: "safe-diffusion",
        parameters: {
          autoSmea: true,
          height: 512,
          width: 512,
          n_samples: 1,
          qualityToggle: true,
          sampler: "k_euler_ancestral",
          scale: 11,
          steps: 28,
          uc: "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry",
          ucPreset: 0,
        },
      }),
    });

    const text = await response.text();

    const data = text.split("data:")[1];
    const image = `data:image/png;base64,${data}`;

    res.status(200).json({ image });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error });
  }
};
