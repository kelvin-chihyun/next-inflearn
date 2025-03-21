import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@next-inflearn/ui/styles/globals.css";
import {
  ReactQueryClientProvider,
  ReactQueryDevtools,
  ThemeProvider,
} from "@next-inflearn/ui/lib";
import { Provider as JotaiProvider } from "jotai";
import { AuthProvider } from "@/utils/context/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TMDBFLIX",
  description: "Netflix clone using TMDB API",
};

export default function RootLayout({
  header,
  children,
  footer,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
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
      <ReactQueryClientProvider>
        <JotaiProvider>
          <ThemeProvider>
            <body className={inter.className}>
              <AuthProvider>
                {header}
                {children}
                {footer}
              </AuthProvider>
            </body>
          </ThemeProvider>
        </JotaiProvider>
        <ReactQueryDevtools />
      </ReactQueryClientProvider>
    </html>
  );
}
