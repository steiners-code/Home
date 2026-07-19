'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./theme-provider";
import { TooltipProvider } from "../ui/tooltip";
import { SidebarProvider } from "../ui/sidebar";
import NextTopProvider from 'nextjs-toploader';
import { useState } from 'react';
import { Toaster } from "sonner";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // 1 minute
                refetchOnWindowFocus: true,
            },
        },
    }))

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
            >
                <NextTopProvider color='#8e51ff' showSpinner={false} />
                <SidebarProvider>
                    <TooltipProvider>
                        {children}
                        <Toaster />
                    </TooltipProvider>
                </SidebarProvider>
            </ThemeProvider>
        </QueryClientProvider >
    );
};

export default AppProvider;