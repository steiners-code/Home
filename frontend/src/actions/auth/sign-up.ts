import { typeSignUpSchema } from "@/lib/schema/auth";
import { deleteJWT } from "@/lib/auth";
import { api } from "@/lib/api";
import axios from "axios";


// -------------------------------- SIGN UP -----------------------------------


interface SignUpResponse {
    message: string;
    field?: "firstName" | "password" | "confirmPassword" | "email" | "privacyPolicy";
    data?: {
        userId: string;
        email: string;
    };
};

interface SignUpActionResult {
    success: boolean;
    message: string;
    field?: SignUpResponse["field"];
    data?: SignUpResponse["data"];
};

export async function signup(
    data: typeSignUpSchema,
): Promise<SignUpActionResult> {
    if (data.password !== data.confirmPassword) {
        return { success: false, message: "Passwords do not match!", field: "confirmPassword" };
    }

    try {
        await deleteJWT();
        const res = await api.post<SignUpResponse>("/auth/signup", {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            privacyPolicy: data.privacyPolicy,
            newsletter: data.newsletterOptIn,
        });
        const { message, data: responseData } = res.data;

        return {
            success: true,
            message,
            data: responseData,
        };

    } catch (error) {
        console.log(error)
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                message: error.response?.data?.message ?? "Signup failed. Please try again.",
                field: error.response?.data?.field ?? ""
            };
        }

        return {
            success: false,
            message: "An unexpected error occurred. Please try again."
        };
    }
}