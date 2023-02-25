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

  return (
    <Popover as="div" className="relative m-8 outline-none">
      <Popover.Button>
        <UserCircleIcon className="text-white outline-none w-7 h-7" />
      </Popover.Button>

      <Popover.Panel className="absolute right-0 z-50 p-2 space-y-4 bg-white border border-main rounded-md shadow-md min-w-[160px] bg-dark">
        <p className="text-white">Hello, {user?.name}</p>

        <div className="block sm:hidden">{!user?.isPro && <GetPremium />}</div>

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
