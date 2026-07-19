// All the backend working services with their urls
// are added in here. These are used by api-gateway
// to re-route request to the target host

export const SERVICE_MAP = {
    user: "http://home-user:3000",
} as const;