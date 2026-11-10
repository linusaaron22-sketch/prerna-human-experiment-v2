import ScrollToTop from "@/components/ScrollToTop";
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "./globals.css";


const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display"
});
const devanagari = localFont({
  src: "../../public/fonts/NotoSansDevanagari.ttf",
  variable: "--font-devanagari",
  weight: "100 900",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Prerna Human Experiment",
  description:
    "An interactive human experiment exploring how people think, perceive, choose, remember, and respond."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable} ${devanagari.variable} bg-midnight text-white antialiased`}>
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
