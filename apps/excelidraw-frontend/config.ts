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

// WebSocket - needs direct connection (not proxied via /api)
export function getWsUrl() {
  return `ws://${getHost()}:8081`;
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
