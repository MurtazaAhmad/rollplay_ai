import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Menu } from "@headlessui/react";
import useAuth from "@/hooks/useAuth";

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

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
    <Menu as="div" className="relative">
      <Menu.Button>
        <UserCircleIcon className="w-7 h-7" />
      </Menu.Button>

      <Menu.Items className="absolute right-0 p-2 space-y-4 border rounded-md shadow-md w-max">
        <Menu.Item>
          <p>Hello, {user?.name}</p>
        </Menu.Item>
        <Menu.Item>
          <button
            onClick={handleLogout}
            className="w-full py-1 text-white bg-red-500 rounded-md"
          >
            Log out
          </button>
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
};

export default UserMenu;
