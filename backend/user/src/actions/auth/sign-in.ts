import { sendOTPVerificationEmail } from "../../lib/mailer";
import { assessLoginRisk } from "./device-trust";
import { getRefreshToken } from "./jwt-refresh";
import { prisma } from "../../lib/db";
import bcrypt from "bcrypt";

/**
 * @signInUser function validates user credentails and returns a signed JWT
 * @param email string, a-z A-Z 0-9 @ . , valid-email
 * @param password string – a-z A-Z 0-9 special characters, min-length: 8
 * 
 * @returns
 * ```
 * Promise<{
 *     status: number,
 *     message: string,
 *     data?: {
 *         userId: string,
 *         email: string
 *     },
 *     field?: string
 * }>
 * ```
 * field specifies the input field name where the error occured
 * at frontend, the field is highlighted and error message is shown
 * 
 * - User email and passwods are validated with Regex string
 * - User with `email` is retrieved, password_hash is compared
 * - An email verification code is sent for double security
 */

type SignInUserReturnType = {
    success: boolean,
    status: number,
    message: string,
    details?: string,
    code: "VERIFY" | "TRUSTED" | "ERROR",
    field?: "email" | "password",
    payload?: {
        userId: string,
        email: string,
        firstName: string,
        lastName?: string,
        auth_time: Date,
    },
    refreshToken?: string,
    otpPayload?: {
        userId: string,
        email: string,
        jti: string,
        purpose: string,
    }
}

export async function signInUser(email: string, password: string, deviceId: string | null, ipAddress: string | null, userAgent: string | null): Promise<SignInUserReturnType> {
    try {
        let code: SignInUserReturnType["code"] = "VERIFY";

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            return { success: false, status: 400, message: "Email should be of type email@example.com", field: "email", code: "ERROR" }
        }
        else if (password.length < 8) {
            return { success: false, status: 400, message: "Password should be of more than 8 characters", field: "password", code: "ERROR" }
        }

        const user = await prisma.user.findUnique({
            where: {
                email
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                password_hash: true,
            },
        });
        if (!user) return { success: false, status: 400, message: "Account don't exists! Try to Sign-up", field: "email", code: "ERROR" }

        const verified = bcrypt.compare(password, user?.password_hash)
        if (!verified) return { success: false, status: 401, message: "Invalid email or password", field: "password", code: "ERROR" }

        if (deviceId) code = await assessLoginRisk(user.id, deviceId);
        if (code !== "TRUSTED") {
            const { success, data, ...res } = await sendOTPVerificationEmail(user?.id, email)
            if (!success || !data) return { success: false, code: "ERROR", ...res }

            return {
                success: true,
                status: 200,
                message: "A verification code has been sent to your email!",
                code,
                otpPayload: {
                    userId: data.userId,
                    email: data.email,
                    jti: data.otpId,
                    purpose: 'email_verification'
                },
            }
        }

        const session = await prisma.session.create({
            data: { userId: user.id, ipAddress, userAgent },
            select: { id: true, createdAt: true }
        });
        const { refreshToken, success, ...tokenRes } = await getRefreshToken(session.id);
        if (!success || !refreshToken) return { success: false, code: "ERROR", ...tokenRes };

        return {
            success: true,
            status: 200,
            code: "TRUSTED",
            message: "Account Successfully Signed In!",
            payload: {
                userId: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user?.lastName ?? undefined,
                auth_time: session.createdAt,
            },
            refreshToken,
        }
    } catch (error) {
        return { success: false, status: 500, message: "Internal Server Error!", code: "ERROR" };
    }
}