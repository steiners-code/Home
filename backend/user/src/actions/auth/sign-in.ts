import { sendOTPVerificationEmail } from "../../lib/mailer";
import { TypeSignInData } from "../../lib/types";
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

export async function signInUser({ email, password }: TypeSignInData) {
    try {
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            return { status: 400, message: "Email should be of type email@example.com", field: "email" }
        }
        else if (password.length < 8) {
            return { status: 400, message: "Password should be of more than 8 characters", field: "password" }
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
        if (!user) return { status: 400, message: "Account don't exists! Try to Sign-up", field: "email" }

        const verified = bcrypt.compare(password, user?.password_hash)
        if (!verified) return { status: 401, message: "Invalid email or password", field: "password" }

        await sendOTPVerificationEmail(user?.id, email)

        return {
            status: 200,
            message: "A verification code has been sent to your email!",
            data: {
                userId: user.id,
                email: user.email,
            }
        }
    } catch (error) {
        console.error(error);
        return { status: 500, message: "Internal Server Error!" };
    }
}