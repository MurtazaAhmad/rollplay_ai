import Link from "next/link";
import useAuth from "@/hooks/useAuth";

import UserMenu from "@/components/UserMenu";

const Navbar = () => {
  const { user } = useAuth();

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
