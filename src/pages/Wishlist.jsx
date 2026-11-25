import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useProducts } from '../context/ProductsContext.jsx'

export default function Wishlist() {
  const { ids } = useWishlist()
  const { getProduct } = useProducts()
  const items = ids.map(getProduct).filter(Boolean)

  if (items.length === 0) {
    return (
      <section className="soon">
        <h1>Your wishlist is empty</h1>
        <p>Press Save on any piece to keep it here.</p>
        <Link className="btn" to="/explore">Find something you like</Link>
      </section>
    )
  }
  return (
    <section className="page">
      <h1 className="page__title">Wishlist</h1>
      <div className="pgrid">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
    </section>
  )
}
