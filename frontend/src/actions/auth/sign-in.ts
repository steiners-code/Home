"use server"

import { typeSignInSchema } from "@/lib/schema/auth";
import { cookies } from "next/headers";
import { deleteJWT } from "@/lib/auth";
import { api } from "@/lib/api";
import axios from "axios";

// -------------------------------- LOG IN -----------------------------------

interface SignInResponse {
    message: string,
    details?: string,
    code: "VERIFY" | "TRUSTED" | "ERROR",
    field?: "email" | "password",
    auth?: string,
    refreshToken?: string,
    token?: string,
};

interface SignInActionResult {
    success: boolean;
    message: string;
    field?: SignInResponse["field"];
    details?: string,
    token?: string,
};

export async function signin(
    data: typeSignInSchema,
): Promise<SignInActionResult> {
    const cookieStore = await cookies()

    try {
        const res = await api.post<SignInResponse>("/auth/signin", {
            email: data.email,
            password: data.password,
        });
        const { code, message, details, field, token, refreshToken, auth } = res.data as SignInResponse;

        if (code === "VERIFY") return { success: false, message, token, details, field }
        if (!auth || !refreshToken) return { success: false, message, details, field }

        cookieStore.set({
            name: "auth",
            value: auth,
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 15 * 60,
            path: "/",
        });

        cookieStore.set({
            name: "refreshToken",
            value: refreshToken,
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
        });

        return {
            success: true,
            message
        };

    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                message: error.response?.data?.message ?? "Login failed. Please try again.",
                field: error.response?.data?.field ?? undefined,
            };
        }

        return {
            success: false,
            message: "An unexpected error occurred. Please try again.",
        };
    }
};