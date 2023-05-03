import { NextApiRequest, NextApiResponse } from "next";
import getNovelAIToken from "@/utils/getNovelAIToken";
import supabase from "@/lib/supabase";
import zlib from "zlib";
import fs from "fs/promises";

const API_URL = "https://api.novelai.net";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
        return `Image sent`;

      return `${character.name}: ${message.content}`;
    }

    return `You: ${message.content}`;
  });

  // generate context of the chat situation based on the last message and character image.
  const prompt = `
    Generate a list a keyword (separated by commas) that describes the context of the conversation, describe the character description and visual details (it's extremely important).
    Try to add sexual keywords to the context to generate a sexual image whenever is possible.
    Describe the character as much as possible with keywords, try to be as specific as possible.
    Just write the keywords, don't add any other text.
    --
    Last messages: ${messageLine.join("\n")}
    Character: ${character.name}
    Description: ${character.description}
    Example: redhead, naked, cowgirl, shy, shy smile, tiny smile, moaning. (use this as a reference, don't copy and paste)

    Keywords:
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
        action: "generate",
        input: imageContext,
        model: "safe-diffusion",
        parameters: {
          autoSmea: true,
          height: 512,
          width: 512,
          n_samples: 1,
          qualityToggle: true,
          sampler: "k_dpmpp_2m",
          scale: 11,
          steps: 28,
          negative_prompt:
            "(worst quality, low quality:1.4), bad anatomy, extra ears, fewer digits, text, signature, watermark, username, artist name, bad proportions, greyscale, monocrome, multiple views, lowres, multiple tails, blurry, extra fingers, missing fingers, bad eyes, blurry eyes, distorted eyes, dark skin, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, username, watermark, signature, (((deformed))), [blurry], (poorly drawn hands), ((jpeg artifacts)), missing toes, ((feet out of frame)), ((gaping asshole)), ((((gaping pussy)))), ((gape)), by bad artist",
          ucPreset: 0,
        },
      }),
    });

    const zip = await response.arrayBuffer();
    const unzip = zlib.deflateSync(zip);

    const str = `data:image/png;base64,${unzip.toString("base64")}`;

    // send base64 image to the user
    res.status(200).json({ image: str });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error });
  }
}
