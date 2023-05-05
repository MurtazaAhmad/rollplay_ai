import { Popover } from "@headlessui/react";
import { GiftIcon } from "@heroicons/react/24/outline";

type Props = {
  gifts: any[];
  buyGift: (gift: any) => void;
};

const GiftModal = ({ gifts, buyGift }: Props) => {
  return (
    <Popover className="absolute right-5 bottom-20">
      <Popover.Panel
        as="div"
        className="absolute right-0 w-64 max-w-xs px-4 py-2 mb-4 text-white rounded-md shadow-xl md:w-72 bottom-full bg-main"
      >
        {/* icon */}
        <header className="inline-flex items-center space-x-2">
          <GiftIcon className="w-5" />
          <h2 className="font-semibold">Do you want to send a gift?</h2>
        </header>

        <ul className="my-2 space-y-2">
          {gifts.map((gift) => (
            <li key={gift.id}>
              <button className="hover:underline" onClick={() => buyGift(gift)}>
                <h3 className="text-sm text-left">
                  {gift.name} - ${gift.price / 1000}
                </h3>
              </button>
            </li>
          ))}
        </ul>
      </Popover.Panel>

      <Popover.Button className="p-4 rounded-full bg-main">
        <GiftIcon className="w-5 h-5 text-white" />
      </Popover.Button>
    </Popover>
  );
};

export default GiftModal;
