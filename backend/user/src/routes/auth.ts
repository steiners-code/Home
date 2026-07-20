import { resendOTPVerificationEmail, verifyOTP } from "../actions/auth/otp-verification";
import { refreshJWT } from "../actions/auth/authorize-user";
import { TypeSignInData, TypeUserData } from "../lib/types";
import { authConfig, otpConfig } from "../lib/auth-config";
import { signInUser } from "../actions/auth/sign-in";
import { signUpUser } from "../actions/auth/sign-up";
import { randomUUID } from "node:crypto";
import Elysia, { t } from "elysia";

export const authRoutes = new Elysia({ prefix: '/auth' })
    .use(authConfig)
    .use(otpConfig)
    .post('/signup', async ({ body, status, ['otp-sign-jwt']: otpSignJwt }) => {
        const data: TypeUserData = body as TypeUserData;

        const { success, data: resData, ...res } = await signUpUser(data);
        if (!success || !resData) return status(res.status, { message: res.message, field: res.field })

        const token = await otpSignJwt.sign(resData);

        return status(res.status, { message: res.message, token });
    })

    .post('/signin', async ({ body, status, jwt, ['otp-sign-jwt']: otpSignJwt, cookie: { deviceId }, headers }) => {
        let auth: string | undefined;
        let token: string | undefined;

        const { email, password }: TypeSignInData = body as TypeSignInData

        const ipAddress = headers['x-forwarded-for'] || null;
        const userAgent = headers['user-agent'] || null;
        const oldDeviceId = deviceId.value as string;

        const { success, payload, refreshToken, code, otpPayload, ...res } = await signInUser(email, password, oldDeviceId, ipAddress, userAgent);
        if (!success) return status(res.status, { message: res.message, details: res.details, field: res.field, code })

        if (payload) auth = await jwt.sign(payload)
        if (otpPayload) token = await otpSignJwt.sign(otpPayload)

        return status(res.status, { message: res.message, auth, refreshToken, token, code });
    })

    .post('/verify-account', async ({ status, jwt, ['otp-verify-jwt']: otpVerifyJwt, body, headers, cookie: { deviceId } }) => {
        const { token, otp } = body as { token: string, otp: string }
        if (!token || !otp) return status(415, "Invalid or Missing Inputs!");

        const oldDeviceId = deviceId.value as string;

        const data = await otpVerifyJwt.verify(token)
        if (!data) return status(400, { message: "Token is Invalid or Expired!" })

        if (data.purpose !== 'email_verification')
            return status(400, { message: "Invalid scope for provided token!" })

        const ipAddress = headers['x-forwarded-for'] || null;
        const userAgent = headers['user-agent'] || null;

        const { payload, refreshToken, newDeviceId, ...res } = await verifyOTP(data, otp, ipAddress, userAgent, oldDeviceId);
        if (!payload || !refreshToken) return status(res.status, res.message);

        const auth = await jwt.sign(payload)

        return status(res.status, { message: res.message, auth, refreshToken, deviceId: newDeviceId })
    })

    .post('/resend-otp', async ({ status, body, ['otp-sign-jwt']: otpSignJwt }) => {
        const { token } = body as { token: string }
        if (!token) return status(415, "Token is required!");

        const data = await otpSignJwt.verify(token)
        if (!data) return status(400, { message: "Token is Invalid or Expired!" })

        if (data.purpose !== 'email_verification')
            return status(400, { message: "Invalid scope for provided token!" })

        const { success, data: otpData, ...res } = await resendOTPVerificationEmail(data.userId, data.jti);
        if (!success || !otpData) return status(res.status, { message: res.message, details: res.details })

        const otpToken = await otpSignJwt.sign(otpData);

        return status(res.status, { message: res.message, token: otpToken })
    })

    .post('/otp-info', async ({ status, body, ['otp-verify-jwt']: otpVerifyJwt }) => {
        const { token } = body as { token: string }
        if (!token) return status(415, "Token is required!");

        const data = await otpVerifyJwt.verify(token)
        if (!data) return status(400, { message: "Token is Invalid or Expired!" })

        if (data.purpose !== 'email_verification')
            return status(400, { message: "Invalid scope for provided token!" })


        return status(200, { email: data.email || "" })
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