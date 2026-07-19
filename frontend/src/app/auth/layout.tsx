import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Auth Home — Headquarters (HQ)",
    description: "Home sweet home — Home of the underworlds",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="w-full min-h-screen">
            {children}
        </div>
    );
}
