"use server";

// -------------------------------- VERIFY EMAIL -----------------------------------

import { cookies } from "next/headers";
import { api } from "@/lib/api";
import axios from "axios";


interface OtpActionResult {
    success: boolean;
    message: string;
}

export async function verifyEmail({
    userId,
    otp,
}: {
    userId: string;
    otp: string;
}): Promise<OtpActionResult> {
    try {
        const cookieStore = await cookies();

        const res = await api.post("/auth/verify-account", { userId, otp });

        cookieStore.set({
            name: "auth",
            value: res.data.auth,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60,
            path: "/",
        });

        cookieStore.set({
            name: "refreshToken",
            value: res.data.refreshToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
        });

        return {
            success: true,
            message: res.data?.message ?? "Email verified successfully!",
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                message: error.response?.data?.message ?? "Invalid or expired OTP.",
            };
        }

        return {
            success: false,
            message: "An unexpected error occurred. Please try again.",
        };
    }
}


// -------------------------------- RESEND OTP -----------------------------------


export async function resendOtp({ userId }: { userId: string }): Promise<OtpActionResult> {
    try {
        const res = await api.post("/auth/resend-otp", { userId });

        return {
            success: true,
            message: res.data?.message ?? "OTP sent successfully!",
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                message: error.response?.data?.message ?? "Failed to resend OTP.",
            };
        }

        return {
            success: false,
            message: "An unexpected error occurred. Please try again.",
        };
    }
}