import { createContext, useEffect, useState } from "react";
import type { FC, ReactNode } from "react";

import { useSupabaseClient } from "@supabase/auth-helpers-react";

type ContextProps = {
  children: ReactNode | ReactNode[];
};

type User = {
  id: string;
  email: string;
  name: string;
};

interface AuthContextType {
  user: User | null;
}

const initial = {
  user: null,
};

export const AuthContext = createContext<AuthContextType>(initial);

const AuthContextProvider: FC<ContextProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const supabase = useSupabaseClient();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          await getUser();
        }

        if (event === "SIGNED_OUT") {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // get user on mount
    getUser().then(() => setLoading(false));

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const getUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      setUser(null);
      setLoading(false);

      return;
    }

    if (user) {
      const data = {
        id: user.id,
        email: user.email,
        name: user.user_metadata.name,
      };

      setUser(data);
      setLoading(false);
    }
  };

  const value = {
    user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
