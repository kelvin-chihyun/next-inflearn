import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider, ReactQueryClientProvider } from "@next-inflearn/ui/lib";
import "@next-inflearn/ui/styles/globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next DropBox",
  description: "A minimalistic Dropbox clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          <ThemeProvider>{children}</ThemeProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
