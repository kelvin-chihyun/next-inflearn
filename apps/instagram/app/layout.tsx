import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@next-inflearn/ui/styles/globals.css";
import {
  ReactQueryClientProvider,
  ReactQueryDevtools,
  ThemeProvider,
} from "@next-inflearn/ui/lib";
import { Provider as JotaiProvider } from "jotai";
import { AuthProvider } from "@/shared/utils/context/AuthProvider";
import { SonnerToaster } from "@next-inflearn/ui";
import { createServerSupabaseClient } from "@next-inflearn/supabase";
import Auth from "./auth/page";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InflearnGram",
  description: "Instagram clone project",
};

export default async function RootLayout({
  children,
  sidebar,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log(session);
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
          integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={inter.className}>
        <ReactQueryClientProvider>
          <JotaiProvider>
            <ThemeProvider>
              <AuthProvider accessToken={session?.access_token ?? ""}>
                {session?.user ? (
                  <div className="flex flex-row w-full h-screen">
                    {sidebar}
                    {children}
                  </div>
                ) : (
                  <Auth />
                )}
                <SonnerToaster />
              </AuthProvider>
            </ThemeProvider>
          </JotaiProvider>
          <ReactQueryDevtools />
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
