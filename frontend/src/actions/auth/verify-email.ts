// -------------------------------- VERIFY EMAIL -----------------------------------

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
        const res = await api.post("/auth/verify-account", { userId, otp });

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