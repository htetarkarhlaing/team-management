// The fallback covers non-secure contexts (plain HTTP dev servers), where
// the Web Crypto API is not exposed.
export function createId(prefix: string): string {
  const unique =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

  return `${prefix}_${unique}`
}
