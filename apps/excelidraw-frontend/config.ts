// Production-ready config with environment variable support

export function getHost() {
  if (typeof window !== "undefined" && window.location?.hostname) {
    return window.location.hostname;
  }
  return "localhost";
}

export function getBackendUrl() {
  // Use environment variable in production, fallback to local dev
  if (process.env.NEXT_PUBLIC_HTTP_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_HTTP_BACKEND_URL;
  }
  return `http://${getHost()}:3002/api`;
}

export function getWsUrl() {
  // Use environment variable in production, fallback to local dev
  if (process.env.NEXT_PUBLIC_WS_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_WS_BACKEND_URL;
  }
  return `ws://${getHost()}:8081`;
}

export function getRoomUrl() {
  // In production, use the same origin
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }
  return `http://${getHost()}:3000`;
}

export function getExileUrl() {
  // In production, use the same origin
  if (typeof window !== "undefined" && window.location.origin) {
    return `${window.location.origin}/canvas`;
  }
  return `http://${getHost()}:3001/canvas`;
}

export function getCanvasUrl() {
  return "/canvas";
}

export function getMLBackendUrl() {
  // Use environment variable in production, fallback to local dev
  if (process.env.NEXT_PUBLIC_ML_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_ML_BACKEND_URL;
  }
  return `http://${getHost()}:3003`;
}
