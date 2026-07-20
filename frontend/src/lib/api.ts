"use server"

import { cookies, headers } from "next/headers";
import axios from 'axios';
import 'dotenv/config';

const SERVER_URL = process.env.SERVER_URL!;

/**
 * Server-side Axios instance mapped to the internal API Gateway.
 * WARNING: This must ONLY be used in Next.js Server environments.
 */
export const api = axios.create({
    baseURL: new URL("/api/v1", SERVER_URL).toString(),
});

/**
 * Server-to-Server Request Interceptor
 * * Intercepts every outgoing request from Next.js to the API Gateway and manually
 * injects the client's real identifying information for Security Fingerprinting.
 * - Extracts 'cf-connecting-ip' (or fallback) for geographic impossibility checks.
 * - Extracts 'user-agent' to detect device hijacking.
 * - Manually reconstructs the 'Cookie' header with the opaque 'refreshToken'
 * so the backend parser picks it up natively.
 */
api.interceptors.request.use(async (config) => {
    const headerStore = await headers();
    const cookieStore = await cookies();

    const userIp = headerStore.get('cf-connecting-ip') || headerStore.get('x-forwarded-for') || '';
    const userAgent = headerStore.get('user-agent') || '';

    const refreshToken = cookieStore.get('refreshToken')?.value;
    const auth = cookieStore.get('auth')?.value
    const deviceId = cookieStore.get('deviceId')?.value

    if (userIp) config.headers['x-forwarded-for'] = userIp;
    if (userAgent) config.headers['user-agent'] = userAgent;

    if (refreshToken) {
        config.headers['Cookie'] = `deviceId=${deviceId}; refreshToken=${refreshToken}; auth=${auth}`
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});