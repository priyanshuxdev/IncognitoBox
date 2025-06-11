import type { Metadata } from "next";
import "@fontsource-variable/urbanist";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";

export const metadata: Metadata = {
  title: "IncognitoBox",
  description:
    "IncognitoBox: Receive anonymous feedback effortlessly through your unique public link.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={`antialiased bg-[#0A0A0A] text-yellow-50`}>
          {children}
          <Toaster />
          <Script
            src="https://buttons.github.io/buttons.js"
            strategy="lazyOnload"
          />
        </body>
      </html>
    </AuthProvider>
  );
}
