import type { Metadata } from "next";
import { Geist, Playfair_Display, EB_Garamond } from "next/font/google";
import { QueryProvider } from "@/shared/providers/QueryProvider";
import { YouTubeBackground } from "@/widgets/YouTubeBackground/YouTubeBackground";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
  style: ["normal", "italic"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
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
  verification: {
    google: "N9o9FsG5QGZbjgUTNpYC0IPA7sXHMMsg00Fbv76433c",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${playfair.variable} ${ebGaramond.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <YouTubeBackground />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
