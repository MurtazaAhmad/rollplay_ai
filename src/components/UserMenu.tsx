import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Popover } from "@headlessui/react";
import useAuth from "@/hooks/useAuth";

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

import GetPremium from "./GetPremium";

const UserMenu = () => {
  const { user } = useAuth();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // redirect to auth
    router.replace("/auth");
  };

  const handleBilling = async () => {
    const res = await fetch(`/api/billing`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user?.id,
      }),
    });

    const { session_url } = await res.json();

    window.location.href = session_url;
  };

  return (
    <Popover as="div" className="relative m-8 outline-none">
      <Popover.Button>
        <UserCircleIcon className="text-white outline-none w-7 h-7" />
      </Popover.Button>

      <Popover.Panel className="absolute right-0 z-50 p-4 space-y-4 bg-white border border-main rounded-md shadow-md min-w-[240px] bg-dark">
        <p className="text-xl text-white">Hello, {user?.name}</p>
        {user?.isPro && <small className="text-white">Premium user ⚡.</small>}

        <div className="block sm:hidden">{!user?.isPro && <GetPremium />}</div>
        {user?.isPro && (
          <button
            onClick={handleBilling}
            className="w-full py-2 mt-2 border rounded-md bg-dark border-main text-main"
          >
            Billing
          </button>
        )}

        <button
          onClick={handleLogout}
          className="w-full py-2 text-white bg-red-500 rounded-md"
        >
          Log out
        </button>
      </Popover.Panel>
    </Popover>
  );
};

export default UserMenu;
