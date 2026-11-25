import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

const WishlistContext = createContext(null)
export const useWishlist = () => useContext(WishlistContext)

export function WishlistProvider({ children }) {
  const [ids, setIds] = useLocalStorage('ff-wishlist', [])

  const has = (id) => ids.includes(id)
  const toggle = (id) =>
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  return <WishlistContext.Provider value={{ ids, has, toggle }}>{children}</WishlistContext.Provider>
}
