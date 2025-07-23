export const isBrowser = (): boolean => {
  if (import.meta.env.MODE === "test") return false
  return typeof window !== "undefined" && typeof window.document !== "undefined"
}
