import { NextApiRequest, NextApiResponse } from "next";
import getNovelAIToken from "@/utils/getNovelAIToken";

const API_URL = "https://api.novelai.net";
const token = process.env.NOVELAI_TOKEN!;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // const token = await getNovelAIToken();

  try {
    const response = await fetch(`${API_URL}/ai/generate-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        input: req.body.prompt,
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
    }).then((res) => res.arrayBuffer());

    res.status(200).send(response);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error });
  }
};
