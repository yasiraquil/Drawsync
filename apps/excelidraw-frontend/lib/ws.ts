/**
 * WebSocket utility for creating connections to the backend.
 * Uses protocol-aware URLs that work with Nginx proxy in production.
 * In development, connects directly to port 8081.
 */

function getBaseWsUrl(): string {
    const isDev = window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";

    if (isDev) {
        // Local development - connect directly to WebSocket server
        return `ws://${window.location.hostname}:8081`;
    }

    // Production - use Nginx proxy at /ws
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    return `${protocol}://${window.location.host}/ws`;
}

export function createWebSocket(path: string = "", params?: Record<string, string>): WebSocket {
    if (typeof window === "undefined") {
        throw new Error("WebSocket can only be created in browser environment");
    }

    let url = `${getBaseWsUrl()}${path}`;

    if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams.toString()}`;
    }

    return new WebSocket(url);
}

/**
 * Get the WebSocket base URL (without creating a connection).
 * Useful when you need to append query parameters manually.
 */
export function getWebSocketUrl(): string {
    if (typeof window === "undefined") {
        return "ws://localhost:8081";
    }

    return getBaseWsUrl();
}
