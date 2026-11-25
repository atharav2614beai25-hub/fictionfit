import { useState, useEffect } from 'react'

// Works like useState, but the value is also saved in the browser (localStorage),
// so it survives a page refresh.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : initialValue
    } catch {
      return initialValue            // storage blocked or data corrupted
    }
  })

  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* ignore */ }
  }, [key, value])

  return [value, setValue]
}
