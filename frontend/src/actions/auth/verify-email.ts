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
    token,
    otp,
}: {
    token: string;
    otp: string;
}): Promise<OtpActionResult> {
    try {
        const cookieStore = await cookies();

        const res = await api.post("/auth/verify-account", { token, otp });
        const data = res.data;

        cookieStore.set({
            name: "auth",
            value: data.auth,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60,
            path: "/",
        });

        cookieStore.set({
            name: "refreshToken",
            value: data.refreshToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
        });

        cookieStore.set({
            name: "deviceId",
            value: data.deviceId,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 365 * 24 * 60 * 60,
            path: "/",
        });

        return {
            success: true,
            message: data?.message ?? "Email verified successfully!",
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


export async function resendOtp({ token }: { token: string }): Promise<OtpActionResult> {
    try {
        const res = await api.post("/auth/resend-otp", { token });
        const data = res.data;

        return {
            success: true,
            message: data?.message ?? "OTP sent successfully!",
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

// -------------------------------- OTP INFO -----------------------------------

export async function getEmail(token: string): Promise<string> {
    try {
        const res = await api.post("/auth/otp-info", { token })
        const data = res.data;

        return data.email as string;
    } catch (error) {
        return ""
    }
}