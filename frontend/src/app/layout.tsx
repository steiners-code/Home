import type { Metadata } from "next";
import { Geist_Mono, Poppins, Inter } from "next/font/google";
import "./globals.css";
import AppProvider from "@/components/providers/AppProvider";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext", "devanagari"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  preload: true,
  style: ["normal", "italic"],
  adjustFontFallback: true,
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home — Headquarters (HQ)",
  description: "Home sweet home — Home of the underworlds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
      <body className={`${poppins.variable} ${geistMono.variable} antialiased`} >
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
