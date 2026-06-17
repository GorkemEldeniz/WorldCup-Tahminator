import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/layout/NavBar";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dünya Kupası Tahmin | 2026 FIFA World Cup Skor Tahmin Oyunu",
  description:
    "2026 FIFA Dünya Kupası maçlarının skorunu tahmin et, puan topla, liderlik tablosunda yüksel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-surface-soft">
        <NavBar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
