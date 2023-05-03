import { NextApiRequest, NextApiResponse } from "next";
import stripe from "@/lib/stripe";
import supabase from "@/lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { chat_id, user_id, payment_intent, gift } = req.query;

  const payment = await stripe.paymentIntents.retrieve(
    payment_intent as string
  );

  // Save the payment info to your database.
  const { error } = await supabase.from("gift_payments").insert([
    {
      chat_id: chat_id,
      user_id: user_id,
      price: payment.amount,
      currency: payment.currency,
      name: gift,
    },
  ]);

  if (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }

  res.redirect(307, `/chat/${chat_id}/?buyGift=true`);
}
