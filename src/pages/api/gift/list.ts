import { NextApiRequest, NextApiResponse } from "next";

type BodyData = {
  messages: Message[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { messages } = req.body as BodyData;

  if (req.method === "POST") {
    const messageLine = messages.map((message) => {
      if (message.isAI) {
        if (message.content.includes("img")) {
          return "Image sent";
        }

        return "Character: " + message.content;
      }

      return "User: " + message.content;
    });

    const prompt = `
        I will provide you a chat conversation between two people,
        and you will generate a list of gifts that would be appropriate to give to the character.
        The list of gifts should be based on the conversation and the character's interests.
        The gift could be an object, an action, or an experience. (e.g. a book, a trip to the beach, a massage, pay the dinner).
        The prices of the gifts should be between $1 and $50.
        You have to provide maximum 3 gifts. In JSON format. With name (or action), price, id, and description.
        The price is an integer between 1 and 50. Multiplied by 100.
        Write just the json array. Anything else will be ignored.
        --
        Conversation
        ${messageLine.join("\n")}
        --
        Gifts:
        
    `;

    try {
      const data = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_SECRET_KEY}`,
        },
        body: JSON.stringify({
          model: "text-davinci-003",
          prompt,
          temperature: 0,
          max_tokens: 2048,
        }),
      }).then((res) => res.json());

      res.status(200).json({ response: data.choices[0].text });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}
