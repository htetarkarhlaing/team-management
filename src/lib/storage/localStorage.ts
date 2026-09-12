// Storage access can fail (SSR, private browsing, quota, corrupt JSON), so
// every helper here degrades to a neutral result instead of throwing.

function getStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null
    return window.localStorage
  } catch {
    return null
  }
}

export function readJson<T>(key: string): T | undefined {
  const storage = getStorage()
  if (!storage) return undefined

  try {
    const raw = storage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : undefined
  } catch {
    return undefined
  }
}

/** Returns false if the write was not possible. */
export function writeJson(key: string, value: unknown): boolean {
  const storage = getStorage()
  if (!storage) return false

  try {
    storage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}
