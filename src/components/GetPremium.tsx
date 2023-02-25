import { Fragment } from "react";
import { Transition, Dialog } from "@headlessui/react";
import useAuth from "@/hooks/useAuth";

const GetPremium = () => {
  const { isProModalOpen, setIsProModalOpen, user } = useAuth();

  const closeModal = () => {
    setIsProModalOpen(false);

    setTimeout(() => {
      document.querySelector("html")!.removeAttribute("style");
    }, 300);
  };

  const openModal = () => {
    setIsProModalOpen(true);
  };

  const getPremium = async () => {
    const res = await fetch(`/api/pro?user_id=${user?.id}`, {
      method: "POST",
    }).then((res) => res.json());

    // Open Stripe Checkout
    window.location.href = res.session_url;
  };

  return (
    <>
      <button className="w-full p-2 rounded-md bg-main" onClick={openModal}>
        Get Premium
      </button>

      <Transition appear show={isProModalOpen} as={Fragment}>
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
                    className="text-lg font-medium leading-6 text-white"
                  >
                    Get Rollplay.ai Premium
                  </Dialog.Title>

                  <div className="my-4">
                    <h4 className="text-4xl text-white">$5.00/month</h4>
                    <p className="mt-4 text-gray-400">
                      <span className="text-main">Unlimited</span> access to all
                      Rollplay.ai features.
                    </p>

                    <ul className="mt-2 list-disc list-inside text-white/80">
                      <li>Unlimited characters and chats.</li>
                      <li>Unlimited messages.</li>
                      <li>Images response from character</li>
                    </ul>
                  </div>

                  <div className="mt-8">
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium border border-transparent rounded-md text-dark bg-main"
                      onClick={getPremium}
                    >
                      Get Premium
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default GetPremium;
