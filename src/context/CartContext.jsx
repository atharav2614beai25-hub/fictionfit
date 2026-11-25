import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { useProducts } from './ProductsContext.jsx'
import { deliveryFor } from '../utils/pricing.js'

const CartContext = createContext(null)
export const useCart = () => useContext(CartContext)

// We save only small "lines" (product id, colour, size, qty) in localStorage.
// Name and price are looked up from the product list every time,
// so the cart always shows current data.
export function CartProvider({ children }) {
  const { products } = useProducts()
  const [lines, setLines] = useLocalStorage('ff-cart', [])

  const items = lines
    .map((l) => ({ ...l, product: products.find((p) => p.id === l.productId) }))
    .filter((i) => i.product)                       // hide lines whose product was deleted

  const count = items.reduce((sum, i) => sum + i.qty, 0)
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.qty, 0)
  const delivery = deliveryFor(subtotal)
  const total = subtotal + delivery

  // Same product + colour + size = same key, so we increase qty instead of adding a duplicate line.
  const add = (product, colour, size, qty = 1) =>
    setLines((prev) => {
      const key = `${product.id}|${colour}|${size}`
      const found = prev.find((l) => l.key === key)
      if (found) {
        return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(l.qty + qty, product.stock) } : l))
      }
      return [...prev, { key, productId: product.id, colour, size, qty: Math.min(qty, product.stock) }]
    })

  const setQty = (key, qty) =>
    setLines((prev) =>
      prev.map((l) => {
        if (l.key !== key) return l
        const stock = products.find((p) => p.id === l.productId)?.stock ?? 1
        return { ...l, qty: Math.max(1, Math.min(qty, stock)) }
      })
    )

  const remove = (key) => setLines((prev) => prev.filter((l) => l.key !== key))
  const clear = () => setLines([])

  return (
    <CartContext.Provider value={{ items, count, subtotal, delivery, total, add, setQty, remove, clear }}>
      {children}
    </CartContext.Provider>
  )
}
