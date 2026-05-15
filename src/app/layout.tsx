import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { QueryProvider } from "@/shared/providers/QueryProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "husky photo",
    template: "%s | husky photo",
  },
  description: "アイドルグループhuskyのフォトアルバム",
  openGraph: {
    title: "husky photo",
    description: "アイドルグループhuskyのフォトアルバム",
    siteName: "husky photo",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
