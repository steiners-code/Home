// import { withCache } from "../lib/cache";
import { prisma } from "../../lib/db";

// Returns user data by userId
export async function getUserById(userId: string) {
    // return await withCache(`user:{userId`,
    //     () => 
    return await prisma.user.findUnique({
        where: {
            id: userId,
        }
    })
    //     3600 * 24,
    // )
}

// Returns user data by email
export async function getUserByEmail(email: string) {
    return await prisma.user.findUnique({
        where: {
            email: email,
        }
    })
}