import "@/styles/globals.css";
import { useState } from "react";
import type { AppProps } from "next/app";

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {
  SessionContextProvider,
  Session as SupabaseSession,
} from "@supabase/auth-helpers-react";
import AuthContextProvider from "@/context/authContext";

import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function App({
  Component,
  pageProps,
}: AppProps<{ initialSession: SupabaseSession }>) {
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient({
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    })
  );

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      {/* Optimized font family */}
      <style global jsx>
        {`
          :root {
            --inter-font: ${inter.style.fontFamily};
          }
        `}
      </style>

      <AuthContextProvider>
        <Component {...pageProps} />
      </AuthContextProvider>
    </SessionContextProvider>
  );
}
