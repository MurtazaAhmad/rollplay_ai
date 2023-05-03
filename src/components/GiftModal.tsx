import { GiftIcon } from "@heroicons/react/24/outline";

type Props = {
  gifts: any[];
  buyGift: (gift: any) => void;
};

const GiftModal = ({ gifts, buyGift }: Props) => {
  return (
    <article className="absolute max-w-xs px-4 py-2 text-white rounded-md bg-main right-5 bottom-20">
      {/* icon */}
      <header className="inline-flex items-center space-x-2">
        <GiftIcon className="w-5" />

        <h2 className="font-semibold">Do you want to send a gift?</h2>
      </header>

      <ul className="space-y-2">
        {gifts.map((gift) => (
          <li key={gift.id}>
            <button className="hover:underline" onClick={() => buyGift(gift)}>
              <h3>
                {gift.name} - ${gift.price / 1000}
              </h3>
            </button>
          </li>
        ))}
      </ul>
    </article>
  );
};

export default GiftModal;
