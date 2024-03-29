import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

import useAuth from "@/hooks/useAuth";

export default function MyModal() {
  const { user } = useAuth();

  let [isOpen, setIsOpen] = useState(true);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform shadow-xl bg-dark rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="mb-4 text-2xl font-medium leading-6 text-white"
                >
                  Welcome, {user?.name}!
                </Dialog.Title>

                <div className="mt-2 space-y-4 text-sm text-gray-400">
                  <p>
                    Since {"you're"} using a free account, {"you're"} limited
                    with the following:
                  </p>

                  <ul className="mt-2 list-disc list-inside text-white/80">
                    <li>
                      <span className="font-medium text-main">1</span> character
                      creation.
                    </li>
                    <li>
                      <span className="font-medium text-main">30</span> messages
                      per day.
                    </li>
                    <li>
                      <span className="font-medium text-main">No images</span>{" "}
                      response from character.
                    </li>
                  </ul>
                  <p>
                    You can upgrade to a premium account to unlock unlimited
                    characters and messages.
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
