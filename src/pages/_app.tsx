import "@/styles/globals.css";
import "swiper/css";
import "swiper/css/pagination";

import { useState } from "react";
import type { AppProps } from "next/app";

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {
  SessionContextProvider,
  Session as SupabaseSession,
} from "@supabase/auth-helpers-react";
import AuthContextProvider from "@/context/authContext";

import { Inter } from "@next/font/google";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

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
      <Head>
        <title>Rollplay.ai - Chat with your favorite characters!</title>
        <meta
          name="description"
          content="Rollplay.ai is a platform where you can chat with your favorite characters from movies, tv shows, games, and more!"
        />
      </Head>

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

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#111",
            color: "#fff",
            textAlign: "center",
          },
        }}
      />
    </SessionContextProvider>
  );
}
