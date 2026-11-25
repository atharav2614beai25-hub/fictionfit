import { createContext, useContext, useCallback } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

const ActivityContext = createContext(null)
export const useActivity = () => useContext(ActivityContext)

// Recently viewed products, saved outfits and simulated orders.
export function ActivityProvider({ children }) {
  const [recentIds, setRecentIds] = useLocalStorage('ff-recent', [])
  const [looks, setLooks] = useLocalStorage('ff-looks', [])
  const [orders, setOrders] = useLocalStorage('ff-orders', [])

  // Newest first, no duplicates, keep 8.
  const addRecent = useCallback(
    (id) => setRecentIds((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 8)),
    [setRecentIds]
  )

  const saveLook = (look) => setLooks((prev) => [...prev, { ...look, id: `look-${Date.now().toString(36)}` }])
  const deleteLook = (id) => setLooks((prev) => prev.filter((l) => l.id !== id))
  const addOrder = (order) => setOrders((prev) => [order, ...prev])

  return (
    <ActivityContext.Provider value={{ recentIds, addRecent, looks, saveLook, deleteLook, orders, addOrder }}>
      {children}
    </ActivityContext.Provider>
  )
}
