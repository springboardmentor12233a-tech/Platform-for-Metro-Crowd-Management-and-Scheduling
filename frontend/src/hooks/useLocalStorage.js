/**
 * useLocalStorage — React state that is synced bidirectionally with localStorage.
 *
 * @template T
 * @param {string} key           — localStorage key
 * @param {T}      initialValue  — default value when key is not found
 * @returns {[T, (value: T | ((prev: T) => T)) => void]}
 *
 * @example
 * const [theme, setTheme] = useLocalStorage('theme', 'dark')
 */
import { useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item !== null ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  /**
   * Setter that mirrors the React setState API (value or updater function).
   * @param {T | ((prev: T) => T)} value
   */
  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (err) {
      console.warn(`useLocalStorage [${key}]:`, err)
    }
  }

  return [storedValue, setValue]
}

export default useLocalStorage
