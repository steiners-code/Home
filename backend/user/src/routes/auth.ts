import { resendOTPVerificationEmail, verifyOTP } from "../actions/auth/otp-verification";
import { refreshJWT } from "../actions/auth/authorize-user";
import { TypeSignInData, TypeUserData } from "../lib/types";
import { signInUser } from "../actions/auth/sign-in";
import { signUpUser } from "../actions/auth/sign-up";
import { authConfig } from "../lib/auth-config";
import Elysia, { t } from "elysia";

export const authRoutes = new Elysia({ prefix: '/auth' })
    .use(authConfig)
    .post('/signup', async ({ body, status }) => {
        const data: TypeUserData = body as TypeUserData;

        const res = await signUpUser(data)

        return status(res.status, { message: res.message, data: res.data, field: res.field });
    })

    .post('/login', async ({ body, status }) => {
        const data: TypeSignInData = body as TypeSignInData

        const res = await signInUser(data);

        return status(res.status, { message: res.message, data: res.data, field: res.field });
    })

    .post('/verify-account', async ({ status, jwt, body, cookie: { auth } }) => {
        const { userId, otp } = body as { userId: string, otp: string }
        if (!userId || !otp) return status(415, "Invalid or Missing Inputs!");

        const res = await verifyOTP(userId, otp);
        if (!res?.data) return status(res.status, res.message);

        const token = await jwt.sign(res?.data)

        return status(res.status, res.message)
    })

    .post('/resend-otp', async ({ status, body }) => {
        const { userId } = body as { userId: string }
        if (!userId) return status(415, "UserId is required!");

        const res = await resendOTPVerificationEmail(userId);

        return status(res.status, { message: res.message, data: res.data })
    })

    .post("/refresh", async ({ cookie: { refreshToken }, jwt, status, headers }) => {
        const ipAddress = headers['x-forwarded-for'] || null;
        const userAgent = headers['user-agent'] || null;
        const irToken = refreshToken.value as string;

        const { token, payload, ...res } = await refreshJWT(irToken, ipAddress, userAgent);

        if (!token || !payload) return status(res.status, { code: res.code, message: res.message, details: res.details })

        const auth = await jwt.sign(payload);

        return status(res.status, {
            code: res.code,
            auth,
            refreshToken: token,
        })
    }, {
        cookie: t.Cookie({
            refreshToken: t.String({ error: "Missing: Token `refresh` is required." }),
        })
    })