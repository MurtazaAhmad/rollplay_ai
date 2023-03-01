import { NextApiRequest, NextApiResponse } from "next";
import stripe from "@/lib/stripe";

type BodyData = {
  price: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { price } = req.body as BodyData;

  if (req.method === "POST") {
    const payment = await stripe.paymentIntents.create({
      amount: parseInt(price) * 100,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.json({ paymentClientSecret: payment.client_secret });
  }
}
