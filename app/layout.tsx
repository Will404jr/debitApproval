import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Background from "@/components/layout/background";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Ask your MD",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} font-sans`}>
        <Background>{children}</Background>
      </body>
    </html>
  );
}
