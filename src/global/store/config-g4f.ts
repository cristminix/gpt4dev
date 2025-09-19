function getCurrentProtocol() {
  return window.location.protocol.slice(0, -1) // Remove trailing colon
}

function getCurrentHost() {
  return window.location.hostname
}

function getCurrentPort() {
  return window.location.port
}
const proto = getCurrentProtocol()
const host = getCurrentHost()
const port = getCurrentPort() || ""
export const G4F_BACKEND_BASE_URL = `${proto}://${host}${
  port.length > 0 ? ":" + port : ""
}`
export const G4F_BACKEND_URL = `${G4F_BACKEND_BASE_URL}/backend-api/v2`
export const CHAT_BACKEND_BASE_URL = G4F_BACKEND_BASE_URL
export const CHAT_BACKEND_URL = `${CHAT_BACKEND_BASE_URL}/api`
