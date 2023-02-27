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

    // discount the number of messages left
    await supabase.auth.admin.updateUserById(user_id as string, {
      user_metadata: {
        messages_left: user?.user_metadata?.messages_left - 1,
      },
    });
    
    // get the number of messages sent today
    res.status(200).send("ok");
  } catch (error) {
    res.status(500).send("error");
  }
}
