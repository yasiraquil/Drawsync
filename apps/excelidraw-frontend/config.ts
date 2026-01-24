// Detect if running in local development
function isDevelopment(): boolean {
  if (typeof window === "undefined") return true;
  return window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";
}

// HTTP Backend - proxied through Nginx in production
export function getBackendUrl() {
  return "/api";
}

// WebSocket - proxied through Nginx at /ws in production
export function getWsUrl() {
  if (typeof window === "undefined") {
    return "ws://localhost:8081"; // SSR fallback (not used for actual connections)
  }

  if (isDevelopment()) {
    // Local development - connect directly to WebSocket server
    return `ws://${window.location.hostname}:8081`;
  }

  // Production - use Nginx proxy at /ws (wss for HTTPS, ws for HTTP)
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  return `${protocol}://${window.location.host}/ws`;
}

// Canvas/Room URL - ALWAYS use relative path for navigation
export function getCanvasUrl() {
  return "/canvas";
}

// ML Backend - proxied through Nginx in production
export function getMLBackendUrl() {
  return "/ml-api";
}

// ============================================
// DEPRECATED: These functions should NOT be used
// They exist only for backwards compatibility
// Use relative paths instead: router.push("/canvas/roomId")
// ============================================

/** @deprecated Use relative path "/room" instead */
export function getRoomUrl() {
  console.warn("getRoomUrl() is deprecated. Use relative path instead.");
  return "/room";
}

/** @deprecated Use getCanvasUrl() or relative path "/canvas" instead */
export function getExileUrl() {
  console.warn("getExileUrl() is deprecated. Use getCanvasUrl() or relative path instead.");
  return "/canvas";
}

/** @deprecated Not needed - use window.location.host if required */
export function getHost() {
  if (typeof window !== "undefined" && window.location?.hostname) {
    return window.location.hostname;
  }
  return "localhost";
}

