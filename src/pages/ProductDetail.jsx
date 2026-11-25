import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Garment from '../components/Garment.jsx'
import ProductCard from '../components/ProductCard.jsx'
import StyleModal from '../components/StyleModal.jsx'
import RecentlyViewed from '../components/RecentlyViewed.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useActivity } from '../context/ActivityContext.jsx'
import { getCollection } from '../data/collections.js'
import { getCharacter } from '../data/characters.js'
import { formatPrice } from '../utils/formatPrice.js'

// Outer component: finds the product from the URL.
export default function ProductDetail() {
  const { id } = useParams()
  const { getProduct } = useProducts()
  const product = getProduct(id)

  if (!product) {
    return (
      <section className="soon">
        <h1>Product not found</h1>
        <p>No product has the address "{id}".</p>
        <Link className="btn" to="/explore">Browse everything</Link>
      </section>
    )
  }
  return <ProductView key={product.id} product={product} />
}

// Inner component: owns the choices (colour, size, quantity).
function ProductView({ product }) {
  const reduce = useReducedMotion()
  const collection = getCollection(product.collection)
  const character = getCharacter(product.character)
  const { getProduct } = useProducts()
  const { add } = useCart()
  const { has, toggle } = useWishlist()
  const { addRecent } = useActivity()

  const [colourIndex, setColourIndex] = useState(0)
  const [size, setSize] = useState(null)
  const [qty, setQty] = useState(1)
  const [message, setMessage] = useState('')
  const [styleOpen, setStyleOpen] = useState(false)

  useEffect(() => { addRecent(product.id) }, [product.id, addRecent])   // remember this visit

  const colour = product.colours[colourIndex]
  const soldOut = product.stock === 0
  const saved = has(product.id)
  const matches = (product.matches ?? []).map(getProduct).filter(Boolean)

  const handleAdd = () => {
    if (!size) { setMessage('Choose a size first.'); return }
    add(product, colour.name, size, qty)
    setMessage(`Added ${qty} to your cart.`)
  }

  return (
    <article className="pdp" style={{ '--accent': collection?.accent, '--panel': collection?.panel }}>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link><span>/</span>
        {collection && <><Link to={`/collection/${collection.id}`}>{collection.name}</Link><span>/</span></>}
        <span>{product.name}</span>
      </nav>

      <div className="pdp__top">
        <motion.div className="pdp__art art" role="img" aria-label={`${product.name} in ${colour.name}, illustration`}
          initial={reduce ? false : { opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
          <Garment category={product.category} colour={colour.hex} />
          <span className="art__char">{product.character}</span>
        </motion.div>

        <motion.div className="pdp__info"
          initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <h1>{product.name}</h1>
          <p className="pdp__price">{formatPrice(product.price)}</p>
          <p>{product.description}</p>

          <div>
            <p className="pdp__label">Colour: {colour.name}</p>
            <div className="swatches">
              {product.colours.map((c, i) => (
                <button key={c.name} type="button" className={`swatch ${i === colourIndex ? 'is-on' : ''}`}
                  style={{ background: c.hex }} aria-label={c.name} aria-pressed={i === colourIndex}
                  onClick={() => setColourIndex(i)} />
              ))}
            </div>
          </div>

          <div>
            <p className="pdp__label">Size: {size ?? 'choose one'}</p>
            <div className="sizes">
              {product.sizes.map((s) => (
                <button key={s} type="button" className={`size ${s === size ? 'is-on' : ''}`}
                  aria-pressed={s === size} onClick={() => setSize(s)}>{s}</button>
              ))}
            </div>
          </div>

          <div className="qty">
            <span className="pdp__label">Quantity</span>
            <button type="button" aria-label="Decrease quantity" disabled={qty <= 1} onClick={() => setQty((q) => q - 1)}>−</button>
            <output>{qty}</output>
            <button type="button" aria-label="Increase quantity" disabled={qty >= product.stock} onClick={() => setQty((q) => q + 1)}>+</button>
          </div>

          <p className="pdp__stock">
            {soldOut ? 'Sold out' : product.stock <= 5 ? `Only ${product.stock} left` : 'In stock'}
          </p>

          <div className="pdp__buttons">
            <button className="btn" type="button" disabled={soldOut} onClick={handleAdd}>
              {soldOut ? 'Sold out' : 'Add to cart'}
            </button>
            <button className="btn btn--ghost" type="button" aria-pressed={saved} onClick={() => toggle(product.id)}>
              {saved ? 'Saved to wishlist' : 'Save to wishlist'}
            </button>
            <button className="btn btn--ghost" type="button" onClick={() => setStyleOpen(true)}>Style it</button>
          </div>
          <p role="status" className="muted">{message}</p>
        </motion.div>
      </div>

      <div className="story">
        <section>
          <h2>Inspired by {product.character}</h2>
          {character && (
            <>
              <p className="story__role">{character.role}</p>
              <p>{character.about}</p>
              <ul>{character.look.map((item) => <li key={item}>{item}</li>)}</ul>
              <p className="story__traits">Traits: {character.traits.join(', ')}</p>
            </>
          )}
          {product.inspiration && (
            <p className="story__link"><strong>How this piece connects:</strong> {product.inspiration}</p>
          )}
        </section>

        {collection && (
          <section>
            <h2>From {collection.name}</h2>
            <p>{collection.source.premise}</p>
            <dl className="facts">
              <dt>Type</dt><dd>{collection.source.medium}</dd>
              <dt>Created by</dt><dd>{collection.source.creator}</dd>
              <dt>Made by</dt><dd>{collection.source.producer}</dd>
              <dt>Years</dt><dd>{collection.source.years}</dd>
            </dl>
            <p className="story__link"><Link className="textlink" to={`/collection/${collection.id}`}>See the whole collection</Link></p>
          </section>
        )}
      </div>

      {matches.length > 0 && (
        <section className="pdp__more">
          <h2 className="section__title">Wear it with</h2>
          <div className="pgrid">{matches.map((m) => <ProductCard key={m.id} product={m} />)}</div>
        </section>
      )}

      <RecentlyViewed exclude={product.id} />

      <p className="pdp__legal">
        FictionFit products are original designs inspired by the stories above. They are not official
        merchandise, and FictionFit is not affiliated with the creators, studios or networks named.
      </p>

      {styleOpen && <StyleModal product={product} onClose={() => setStyleOpen(false)} />}
    </article>
  )
}
