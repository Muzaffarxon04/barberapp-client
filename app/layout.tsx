import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalHeader from "@/components/ConditionalHeader";
import ConditionalFooter from "@/components/ConditionalFooter";
import Toaster from "@/components/Toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Barbershop Booking - Uzbekistan",
  description: "Online barbershop booking platform for Uzbekistan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ConditionalHeader />
        <main className="min-h-screen">{children}</main>
        <ConditionalFooter />
        <Toaster />
      </body>
    </html>
  );
}
