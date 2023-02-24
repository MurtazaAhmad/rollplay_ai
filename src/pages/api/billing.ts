import { NextApiRequest, NextApiResponse } from "next";
import stripe from '@/lib/stripe';

const YOUR_DOMAIN = process.env.NEXT_PUBLIC_HOST_URL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { session_id } = req.body;
  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

  // This is the url to which the customer will be redirected when they are done
  // managing their billing with the portal.
  const returnUrl = YOUR_DOMAIN;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer as string,
    return_url: returnUrl,
  });

  res.json({ session_url: portalSession.url, session_id: portalSession.id });
}
