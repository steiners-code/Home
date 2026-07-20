import { prisma } from "../../lib/db";

export type LoginRiskVerdict = "TRUSTED" | "VERIFY";

/**
 * Checks whether the given deviceId has previously been trusted for this
 * specific user. An exact (userId, deviceId) match is the only case that
 * counts as "trusted" — a new device, a device trusted for a different
 * user, or no cookie at all all fall through to "verify".
 */
export async function assessLoginRisk(
    userId: string,
    deviceId: string
): Promise<LoginRiskVerdict> {
    const device = await prisma.trustedDevice.findUnique({
        where: { userId_deviceId: { userId, deviceId } },
    });

    return device ? "TRUSTED" : "VERIFY";
}

/**
* Call this once OTP verification succeeds — either right after signup's
* forced email verification, or after a "verify" login clears its OTP
* step — to remember the device going forward. Upsert keeps lastSeenAt and
* lastIp fresh on repeat trusted logins without creating duplicate rows.
*/
export async function trustDevice(
    userId: string,
    deviceId: string,
    ip: string | null,
    userAgent: string | null,
): Promise<void> {
    await prisma.trustedDevice.upsert({
        where: { userId_deviceId: { userId, deviceId } },
        update: { lastIp: ip, userAgent },
        create: { userId, deviceId, lastIp: ip, userAgent },
    });
}

