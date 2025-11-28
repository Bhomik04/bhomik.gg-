import type { Metadata } from "next";
import { Suspense } from "react";
import { Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";
import Scanlines from "@/components/ui/Scanlines";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bhomik Goyal | Netrunner Portfolio",
  description: "A Living Portfolio RPG",
};

import Navigation from "@/components/ui/Navigation";

// ... imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${orbitron.variable} ${rajdhani.variable} antialiased bg-cyber-black text-foreground overflow-hidden h-screen w-screen`}
      >
        <Scanlines />
        <Suspense fallback={null}>
          <Navigation />
        </Suspense>
        <main className="relative z-10 h-full w-full overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
