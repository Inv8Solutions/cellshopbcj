import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BJMP-CAR SHOP - Empowering Second Chances Through Livelihood",
  description: "Every purchase supports the livelihood and rehabilitation of persons deprived of liberty under BJMP's national programs.",
  keywords: "BJMP, cellshop, handicrafts, livelihood, rehabilitation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
