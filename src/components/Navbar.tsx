import Link from "next/link";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import useAuth from "@/hooks/useAuth";

import UserMenu from "@/components/UserMenu";

const Navbar = () => {
  const { user } = useAuth();
  const supabase = useSupabaseClient();

  return (
    <nav className="flex items-center justify-between p-4">
      <Link href="/" className="text-xl font-bold">
        Rollplay.ai
      </Link>

      <div className="flex items-center">{user && <UserMenu />}</div>
    </nav>
  );
};

export default Navbar;
