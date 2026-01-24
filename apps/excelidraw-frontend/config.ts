export function getHost() {
  if (
    typeof window !== "undefined" &&
    window.location &&
    window.location.hostname
  ) {
    return window.location.hostname;
  }
  return "localhost";
}

// HTTP Backend - proxied through Nginx in production
export function getBackendUrl() {
  return "/api";
}

// WebSocket - proxied through Nginx at /ws in production
// In development, connect directly to port 8081
export function getWsUrl() {
  if (typeof window !== "undefined") {
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
  // Fallback for SSR (should not be used for actual WebSocket connections)
  return "ws://localhost:8081";
}

export function getRoomUrl() {
  return `http://${getHost()}:3000`;
}

export function getExileUrl() {
  return `http://${getHost()}:3001/canvas`;
}

// ML Backend - proxied through Nginx in production
export function getMLBackendUrl() {
  return "/ml-api";
}
