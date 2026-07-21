import { api } from "@/lib/api";

export async function connectApp() {
    try {
        const res = await api.get("/auth/pid");
        const data = res.data as { pid: string, message: string };

        return { success: true, message: data.message, pid: data.pid }
    } catch (error) {
        return { success: false, message: "Unexpected Error Occurred!", details: error instanceof Error ? error.message : "Something went wrong while trying to authorize." }
    }
}