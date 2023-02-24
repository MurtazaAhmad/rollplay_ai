import { NextApiRequest, NextApiResponse } from "next";
import stripe from "@/lib/stripe";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { subscription_id } = req.query;

  const subscription = await stripe.subscriptions.retrieve(
    subscription_id as string
  );

  if (subscription.status === "active") {
    res
      .status(200)
      .json({ active: true, end: subscription.current_period_end });
    return;
  }

  res
    .status(200)
    .json({ active: false, message: "Subscription is not active." });
}
