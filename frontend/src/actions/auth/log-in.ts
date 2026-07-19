import { typeLoginSchema } from "@/lib/schema/auth";
import { deleteJWT } from "@/lib/auth";
import { api } from "@/lib/api";
import axios from "axios";

// -------------------------------- LOG IN -----------------------------------

interface LogInResponse {
    message: string;
    field?: "password" | "email";
    data?: {
        userId: string;
        email: string;
    };
};

interface LogInActionResult {
    success: boolean;
    message: string;
    field?: LogInResponse["field"];
    data?: LogInResponse["data"];
};

export async function login(
    data: typeLoginSchema,
): Promise<LogInActionResult> {
    await deleteJWT();

    try {
        const res = await api.post<LogInResponse>("/auth/signin", {
            email: data.email,
            password: data.password,
        });
        const { message, data: responseData } = res.data;

        return {
            success: true,
            message,
            data: responseData,
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