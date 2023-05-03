import { useState } from "react";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import { useRouter } from "next/router";
import useAuth from "@/hooks/useAuth";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

const host_url = process.env.NEXT_PUBLIC_HOST_URL!;

const GiftForm = ({ gift }: { gift: any }) => {
  const [loading, setLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const { query } = useRouter();
  const { user } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${host_url}/api/saveGift?chat_id=${query.id}&user_id=${user?.id}&gift=${gift.name}`,
      },
      // redirect: "if_required",
    });

    if (result.error) {
      setLoading(false);
      console.log(result.error.message);
      return;
    }
    
    // console.log(result.paymentIntent);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />

      <button
        disabled={loading}
        className="inline-flex items-center justify-center w-full py-2 mt-6 rounded-md bg-main disabled:opacity-50"
      >
        {loading ? (
          <EllipsisHorizontalIcon className="h-5 text-center animate-pulse" />
        ) : (
          "Buy Gift"
        )}
      </button>
    </form>
  );
};

export default GiftForm;
