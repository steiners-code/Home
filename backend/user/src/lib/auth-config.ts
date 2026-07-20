import { importPrivateKey, importPublicKey } from "./keys";
import { Elysia, t } from 'elysia';
import jwt from "@elysia/jwt";

if (!process.env.JWT_PRIVATE_KEY || !process.env.JWT_PUBLIC_KEY) {
    throw new Error("FATAL: JWT cryptographic keys are missing from environment variables!");
}

// Import them directly on startup
const publicKey = await importPublicKey(process.env.JWT_PUBLIC_KEY);
const privateKey = await importPrivateKey(process.env.JWT_PRIVATE_KEY);

// auth-config.ts reads the public key for decoding, 
// gets the cryptographic publicKey and uses @elysiajs/jwt
// for defining JWT verification schema name as 'jwt'
// the configuration is then returned as "authConfig"

export const authConfig = new Elysia({ name: 'auth-config' })
    .use(
        jwt({
            name: 'jwt',
            secret: privateKey,
            alg: 'RS256',
            exp: '15m',
            schema: t.Object({
                userId: t.String(),
                firstName: t.String(),
                lastName: t.Optional(t.String()),
                email: t.String(),
                auth_time: t.Date(),
            })
        })
    )

export const otpConfig = new Elysia({ name: 'otp-config' })
    .use(
        jwt({
            name: 'otp-sign-jwt',
            secret: privateKey,
            alg: 'RS256',
            schema: t.Object({
                userId: t.String(),
                email: t.String(),
                purpose: t.String(),
                jti: t.String(),
            })
        })
    )
    .use(
        jwt({
            name: 'otp-verify-jwt',
            secret: publicKey,
            alg: 'RS256',
            schema: t.Object({
                userId: t.String(),
                email: t.String(),
                purpose: t.String(),
                jti: t.String(),
            }),
        })
    )