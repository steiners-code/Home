import { createOpaqueRefreshToken } from "../../lib/crypto";
import { verifyFingerprint } from "./verify-signature";
import { prisma } from "../../lib/db";
import { createHash } from "crypto";
import { addDays } from "date-fns";

export async function getUserPayload(userId: string, auth_time?: Date) {
    try {
        const userData = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
            }
        });

        if (!userData)
            return {
                status: 400,
                success: false,
                message: "User does not exist."
            }

        const payload = {
            userId: String(userData.id),
            firstName: String(userData.firstName),
            lastName: userData.lastName ? String(userData.lastName) : undefined,
            email: String(userData.email),
            auth_time: auth_time || new Date(),
        };

        return {
            status: 200,
            success: true,
            message: "Successfully identified user profile.",
            payload,
        }
    } catch (error) {
        return {
            status: 500,
            success: false,
            message: "Server Error: Profile identification failed.",
            details: error instanceof Error ? error.message : String(error)
        };
    }
}

export async function getRefreshToken(sessionId: string) {
    try {
        const { rawToken, hash } = createOpaqueRefreshToken();

        await prisma.refreshToken.create({
            data: {
                hash,
                sessionId,
                expiresAt: addDays(new Date(), 30)
            }
        });

        return {
            success: true,
            status: 200,
            message: `Created refresh token for session`,
            refreshToken: rawToken,
        }
    } catch (error) {
        return {
            status: 500,
            success: false,
            message: `Server Error: Failed to create refresh token for user ${sessionId}`,
        }
    }
};

export async function refreshJWT(token: string, ipAddress: string | null, userAgent: string | null) {
    try {
        const tokenHash = createHash('sha256').update(token).digest('hex');

        const existingToken = await prisma.refreshToken.findUnique({
            where: { hash: tokenHash },
            select: {
                id: true,
                expiresAt: true,
                isUsed: true,
                sessionId: true,
                session: { select: { ipAddress: true, userAgent: true, userId: true, createdAt: true, isRevoked: true } },
            },
        });

        if (!existingToken)
            return {
                status: 400,
                code: 'SIGN_IN',
                message: "Unauthorized: Invalid Token",
                details: "The refresh token you have provided does not exist."
            }

        if (existingToken.isUsed)
            return {
                status: 400,
                code: 'SIGN_IN',
                message: "Suspicious Activity: Re-Authorize required.",
                details: "The refresh token you have provided has already been used. Re-authorize to monitor your connected devices."
            }

        const session = existingToken.session;

        if (session.isRevoked)
            return {
                status: 400,
                code: 'SIGN_IN',
                message: "This session has been revoked.",
                details: "Please signin again for a new session."
            }

        // Validate user fingerprint or establish the fingerprint only if the fields are present
        // Skip the verification if nothing is present for the UX's sake
        if (ipAddress && userAgent) {
            if (session.ipAddress && session.userAgent) {
                const { valid, reasons, ...res } = await verifyFingerprint(session.userId, existingToken.sessionId, session.ipAddress, session.userAgent, ipAddress, userAgent)
                if (!valid)
                    return { status: 400, ...res, details: JSON.stringify(reasons) }
            };

            await prisma.session.update({
                where: { id: existingToken.sessionId },
                data: { ipAddress, userAgent }
            });
        }

        await prisma.refreshToken.update({
            where: { id: existingToken.id },
            data: { isUsed: true }
        });

        const { rawToken, hash } = createOpaqueRefreshToken();

        await prisma.refreshToken.create({
            data: {
                hash,
                sessionId: existingToken.sessionId,
                expiresAt: existingToken.expiresAt,
            }
        });

        const { success, payload, ...res } = await getUserPayload(session.userId, session.createdAt);
        if (!success || !payload) return { code: 'ERROR', ...res, details: "Unable to fetch payload. Please re-authorize with Home." };

        return {
            status: 200,
            code: 'SUCCESS',
            message: "Created refresh token for session",
            token: rawToken,
            payload,
        }
    } catch (error) {
        return {
            status: 500,
            code: 'SERVER_ERROR',
            message: "Failed to create refresh token for session",
            details: error instanceof Error ? error.message : "Unexpected Server Error!"
        }
    }
}