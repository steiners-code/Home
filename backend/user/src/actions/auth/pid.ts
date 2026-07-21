import { prisma } from "../../lib/db";
import { addMinutes, isFuture } from "date-fns";

export async function getPid(userId: string) {
    try {
        await prisma.tempAuth.deleteMany({ where: { userId } });

        const expiresAt = addMinutes(new Date(), 15);

        const data = await prisma.tempAuth.create({
            data: {
                userId,
                expiresAt,
            }
        })

        return {
            success: true,
            status: 200,
            message: "Successfully generated PID",
            pid: data.pid,
        }
    } catch (error) {
        return {
            success: false,
            status: 500,
            message: "Couldn't generate PID",
            details: error instanceof Error ? error.message : "Internal Server Error!"
        }
    }
}

export async function getPayload(pid?: string, userId?: string) {
    try {
        if (pid) {
            const data = await prisma.tempAuth.findUnique({
                where: { pid },
                select: {
                    expiresAt: true,
                    user: { select: { id: true, firstName: true, lastName: true, email: true } }
                }
            })

            if (!data) return { status: 400, success: false, message: "PID is Invalid or Does NOT exist" }
            if (!isFuture(data?.expiresAt)) return { status: 400, success: false, message: "PID is invalid or expired." }

            await prisma.tempAuth.delete({
                where: { pid }
            })

            return {
                status: 200,
                success: true,
                message: "PID Verified!",
                payload: {
                    userId: data.user.id,
                    firstName: data.user.firstName,
                    lastName: data.user.lastName,
                    email: data.user.email,
                }
            }
        }

        if (userId) {
            const data = await prisma.user.findUnique({
                where: { id: userId },
                select: { id: true, firstName: true, lastName: true, email: true }
            })

            if (!data) return { status: 400, success: false, message: "UserId is Invalid or Does NOT exist" }

            return {
                status: 200,
                success: true,
                message: "Successfully retrieved Payload",
                payload: {
                    userId: data.id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email
                }
            }
        }

        return {
            status: 400,
            success: false,
            message: "Missing Inputs: Either PID or UserId is required"
        }
    } catch (error) {
        return {
            status: 500,
            success: false,
            message: "Something went wrong!",
            details: error instanceof Error ? error.message : "Internal Server Error!",
        }
    }
}