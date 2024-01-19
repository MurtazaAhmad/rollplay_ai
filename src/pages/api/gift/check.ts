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
        I want you to become a dating guru and help me decide if it will be the right time to give a gift. You will be given a conversation to analyze. Based on the conversation, I need you to advise me if it seems like an ideal time to give the character a gift based on the conversation.  An ideal time would be if there are positive interactions, shared interests, upcoming events, gift-giving occasions, or signs of interest. If you think it is an ideal time to give a gift, reply with "true", if it is not an ideal time reply with "false". Reply only with "true" or "false".
        --
        Conversation
        ${messageLine.join("\n")}

        Response:
        
    `;


    try {
      const data = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_SECRET_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo-instruct",  //text-davinci-003
          prompt,
          temperature: 0,
        }),
      })

      const json = await data.json();
      res.status(200).json({ response: json.choices[0].text });
    } catch (error: unknown) {
      console.log((error as Error).message);
      res.status(500).json({ error });
    }
  }
}
