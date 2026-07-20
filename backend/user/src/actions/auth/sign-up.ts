import { sendOTPVerificationEmail } from "../../lib/mailer";
import type { TypeUserData } from '../../lib/types';
import { getUserByEmail } from '../user/users';
import { prisma } from "../../lib/db";
import bcrypt from 'bcrypt';

/**
 * @getOrCreateFreeTier 
 * @returns String, free tier id
 * 
 * - This creates a free tier using upsert, if free tier exists
 * - tierId is first cached in memory and then returned.
*/

// freeTiereId stored in memory of the server so reduce db queries
let cachedFreeTierId: string | null = null;

// export async function getORcreateFreeTier() {
//     if (cachedFreeTierId) return cachedFreeTierId;

//     const tier = await prisma.subscriptionTier.upsert({
//         where: { slug: 'free-tier' },
//         update: {},
//         create: {
//             price: 0,
//             slug: 'free-tier',
//             base_store_limit: 1,
//             base_product_limit: 50,
//             base_ai_daily_limit: 100,
//             base_team_member_limit: 0,
//             features: {
//                 templates: ["simple-store"],
//                 store_types: ["e-commerce"]
//             },
//         },
//         select: { id: true },
//     });

//     cachedFreeTierId = tier.id;
//     return tier.id;
// }

/**
 * @signUpUser function, user data is processed for creating user account in db
 * @param firstName required string, legal first name of user
 * @param lastName optional string, last name of user
 * @param username required a-z A-Z 0-9 - _ , min-length: 3, max-length: 16
 * @param email string, a-z A-Z 0-9 @ . , valid-email
 * @param password string – a-z A-Z 0-9 special characters, min-length: 8
 * @param privacyPolicy boolean, required value `true`, user must accept privacy policies before proceeding
 * @param newsletter boolean, user can opt-in for receiving news letters and updates
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
 * - firstName and lastName are trimmed to remove excessive spaces and line breaks
 * - User data is validated though Regex strings.
 * - If any entry fails the check, an error message is returned
 * - Then checks for existing username and email are made for unqiue constraints
 * - Hashed password using bcrypt is stored in db along with other user credentials
 * - Free tier is associated with user account on sign-up
 * - A verification email is sent to user's email address
*/

export async function signUpUser({ firstName, lastName, email, password, privacyPolicy, newsletter }: TypeUserData) {
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    try {
        if (!privacyPolicy) {
            return { success: false, status: 400, message: "You must agree to terms & conditions", field: "privacyPolicy" }
        }
        if (trimmedFirstName.length === 0) {
            return { success: false, status: 400, message: "First name is required", field: "firstName" };
        }
        else if (!/^[a-zA-Z\s\-]+$/.test(trimmedFirstName)) {
            return { success: false, status: 400, message: "Name should contain only letters, spaces, or hyphens", field: "firstName" };
        }
        else if (trimmedLastName.length !== 0 && !/^[a-zA-Z\s\-]+$/.test(trimmedLastName)) {
            return { success: false, status: 400, message: "Name should contain only letters, spaces, or hyphens", field: "lastName" };
        }
        else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            return { success: false, status: 400, message: "Email should be of type email@example.com", field: "email" }
        }
        else if (password.length < 8) {
            return { success: false, status: 400, message: "Password should be of more than 8 characters", field: "password" }
        }

        const emailExists = await getUserByEmail(email)
        if (emailExists) return { success: false, status: 400, message: "Account already exists! Try to Log-in", field: "email" }

        const password_hash = await bcrypt.hash(password, 10);

        // const tierId = await getORcreateFreeTier();

        try {
            const user = await prisma.user.create({
                data: {
                    firstName: trimmedFirstName,
                    lastName: trimmedLastName,
                    email,
                    password_hash,
                    newsletter,
                    // tierId: tierId
                },
            });

            const { success, data, ...otpRes } = await sendOTPVerificationEmail(user.id, email)
            if (!success || !data) return { success: false, ...otpRes };

            return {
                success: true,
                status: 200,
                message: "Account created successfully!",
                data: {
                    userId: data.userId,
                    email: data.email,
                    purpose: 'email_verification',
                    jti: data.otpId
                }
            }
        } catch (e) {
            return { success: false, status: 400, message: "Something went wrong!", field: "email" }
        }

    } catch (error) {
        return { success: false, status: 500, message: "Internal Server Error!" };
    }
}