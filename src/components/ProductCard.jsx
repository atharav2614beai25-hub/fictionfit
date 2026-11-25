import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductImage from './ProductImage.jsx'
import StyleModal from './StyleModal.jsx'
import { getCollection } from '../data/collections.js'
import { useWishlist } from '../context/WishlistContext.jsx'
import { usePageTransition } from '../context/TransitionContext.jsx'
import { formatPrice } from '../utils/formatPrice.js'

export default function ProductCard({ product }) {
  const collection = getCollection(product.collection)
  const { has, toggle } = useWishlist()
  const { openPage } = usePageTransition()
  const [styleOpen, setStyleOpen] = useState(false)
  const saved = has(product.id)
  const to = `/product/${product.id}`

  // Normal click plays the transition. Ctrl/Cmd/Shift-click still opens normally.
  const handleClick = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    openPage(to, collection)
  }

  return (
    <article className="pcard" style={{ '--accent': collection?.accent, '--panel': collection?.panel }}>
      <Link to={to} className="pcard__link" onClick={handleClick}>
        <ProductImage product={product} />
        <div className="pcard__body">
          <h3 className="pcard__name">{product.name}</h3>
          <p className="pcard__meta">Inspired by {product.character}</p>
          <p className="pcard__price">
            {formatPrice(product.price)}
            {product.stock === 0 && <span className="pcard__soldout">Sold out</span>}
          </p>
        </div>
      </Link>
      <div className="pcard__actions">
        <button type="button" onClick={() => setStyleOpen(true)}>Style it</button>
        <button type="button" aria-pressed={saved} onClick={() => toggle(product.id)}>
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>
      {styleOpen && <StyleModal product={product} onClose={() => setStyleOpen(false)} />}
    </article>
  )
}
