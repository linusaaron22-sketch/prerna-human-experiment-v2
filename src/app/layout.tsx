import ScrollToTop from "@/components/ScrollToTop";
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Noto_Sans_Devanagari } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";


const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display"
});
const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-devanagari"
});

export const metadata: Metadata = {
  title: "Arise Offical",
  description: "Registration Website"
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
