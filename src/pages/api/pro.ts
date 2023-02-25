import { NextApiRequest, NextApiResponse } from "next";
import stripe from "@/lib/stripe";

const YOUR_DOMAIN = process.env.NEXT_PUBLIC_HOST_URL;

type BodyData = {
  user_id: number | string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user_id } = req.query as BodyData;

  const price_id = process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID;

  if (req.method === "POST") {
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "auto",
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: `${YOUR_DOMAIN}/api/subscription?success=true&session_id={CHECKOUT_SESSION_ID}&user_id=${user_id}`,
      cancel_url: `${YOUR_DOMAIN}/`,
    });

    res.json({ session_url: session.url, session_id: session.id });
  }
}
