import Link from "next/link";
import useAuth from "@/hooks/useAuth";

import UserMenu from "@/components/UserMenu";
import GetPremium from "@/components/GetPremium";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="relative flex items-center justify-end">
      <div className="absolute top-0 px-12 pb-4 -translate-x-1/2 bg-white rounded-b-full left-1/2">
        <Link href="/">
          <img
            src="/assets/logo-flat.png"
            alt="Rollplay logo"
            className="object-contain w-16 mt-2 aspect-square"
          />
        </Link>

        <Link
          href="/"
          className="absolute left-0 right-0 block w-full text-2xl font-bold text-center -bottom-12 text-main"
        >
          Rollplay.<span className="text-white">ai</span>
        </Link>
      </div>

      {user && (
        <div className="flex items-center">
          <div className="hidden sm:block">{!user.isPro && <GetPremium />}</div>
          <UserMenu />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
