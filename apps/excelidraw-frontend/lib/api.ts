/**
 * Shared API utility for making requests to the backend.
 * All requests go through relative paths that are proxied by Nginx in production
 * or Next.js rewrites in development.
 */

export async function api(
    path: string,
    options: RequestInit = {}
): Promise<Response> {
    return fetch(`/api${path}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });
}

export async function mlApi(
    path: string,
    options: RequestInit = {}
): Promise<Response> {
    return fetch(`/ml-api${path}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });
}
