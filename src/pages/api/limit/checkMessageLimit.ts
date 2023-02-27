import { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // user id
  const { user_id } = req.body;

  try {
    // get the user from the database
    const {
      data: { user },
    } = await supabase.auth.admin.getUserById(user_id as string);

    // if messages left is undefined, set it to 30
    if (user?.user_metadata?.messages_left === undefined) {
      await supabase.auth.admin.updateUserById(user_id as string, {
        user_metadata: {
          messages_left: 30,
        },
      });
    }

    // check if the user has messages left
    if (user?.user_metadata?.messages_left <= 0) {
      res.status(200).send({ messages_left: 0 });
      return;
    }

    res.status(200).send({ messages_left: user?.user_metadata?.messages_left });
  } catch (error) {
    res.status(500).send("error");
  }
}
