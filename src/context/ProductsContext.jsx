import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { initialProducts } from '../data/products.js'

const ProductsContext = createContext(null)
export const useProducts = () => useContext(ProductsContext)

// Defaults for fields that the admin form does not ask for.
const blank = { inspiration: '', styling: [], matches: [], popularity: 50, isNew: true, isTrending: false, image: null }

export function ProductsProvider({ children }) {
  const [products, setProducts] = useLocalStorage('ff-products', initialProducts)

  const getProduct = (id) => products.find((p) => p.id === id)

  const addProduct = (data) =>
    setProducts((prev) => [...prev, { ...blank, ...data, id: `ff-${Date.now().toString(36)}` }])

  const updateProduct = (id, changes) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)))

  const deleteProduct = (id) => setProducts((prev) => prev.filter((p) => p.id !== id))

  // lines: [{ productId, qty }]. Used when an order is placed.
  const reduceStock = (lines) =>
    setProducts((prev) =>
      prev.map((p) => {
        const used = lines.filter((l) => l.productId === p.id).reduce((sum, l) => sum + l.qty, 0)
        return used ? { ...p, stock: Math.max(0, p.stock - used) } : p
      })
    )

  const resetProducts = () => setProducts(initialProducts)

  return (
    <ProductsContext.Provider
      value={{ products, getProduct, addProduct, updateProduct, deleteProduct, reduceStock, resetProducts }}>
      {children}
    </ProductsContext.Provider>
  )
}
