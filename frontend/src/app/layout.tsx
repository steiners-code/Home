import type { Metadata } from "next";
import { Geist_Mono, Poppins, Inter } from "next/font/google";
import "./globals.css";
import AppProvider from "@/components/providers/AppProvider";
import { cn } from "@/lib/utils";
import Link from "next/link";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

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
  verification: {
    google: 'Hafg67vRuHogGCAYuu5HskRHDMYT5b0mwfINoyH-Hlk',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
      <body className={`${poppins.variable} ${geistMono.variable} antialiased min-h-screen`} >
        <AppProvider>
          <nav className="border-b border-zinc-800 p-4 sticky top-4 bg-zinc-900 z-50">
            <div className="max-w-4xl mx-auto flex gap-6">
              <Link href="/" className="hover:text-white font-medium">Home</Link>
              <Link href="/privacy" className="hover:text-white font-medium">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white font-medium">Terms of Service</Link>
            </div>
          </nav>

          <main className="max-w-4xl mx-auto p-6 md:p-8">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
