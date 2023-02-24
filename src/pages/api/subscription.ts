import { NextApiRequest, NextApiResponse } from "next";
import stripe from "@/lib/stripe";
import supabase from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { session_id, user_id } = req.query;

  const session = await stripe.checkout.sessions.retrieve(session_id as string);

  // Save the subscription to your database.
  await supabase
    .from("users")
    .update({ subscription_id: session.subscription, session_id: session.id })
    .eq("user_id", user_id);

  res.redirect(307, "/?successPro=true");
}
