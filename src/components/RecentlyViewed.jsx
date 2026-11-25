import ProductCard from './ProductCard.jsx'
import { useActivity } from '../context/ActivityContext.jsx'
import { useProducts } from '../context/ProductsContext.jsx'

// exclude: an id to leave out (the product page you are already on)
export default function RecentlyViewed({ exclude }) {
  const { recentIds } = useActivity()
  const { getProduct } = useProducts()
  const items = recentIds.filter((id) => id !== exclude).map(getProduct).filter(Boolean).slice(0, 4)

  if (items.length === 0) return null
  return (
    <section className="section">
      <h2 className="section__title">Recently viewed</h2>
      <div className="pgrid">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
    </section>
  )
}
