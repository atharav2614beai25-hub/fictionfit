import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Garment from './Garment.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import { getCollection } from '../data/collections.js'
import { formatPrice } from '../utils/formatPrice.js'

// Uses the browser's built-in <dialog>: it traps focus, closes with Esc, and dims the page.
export default function StyleModal({ product, onClose }) {
  const ref = useRef(null)
  const { getProduct } = useProducts()
  const collection = getCollection(product.collection)
  const partners = (product.matches ?? []).map(getProduct).filter(Boolean)
  const tips = product.styling ?? []

  useEffect(() => { ref.current?.showModal() }, [])

  return (
    <dialog
      ref={ref} className="modal" onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) ref.current.close() }}   // click on the dark area closes it
      aria-labelledby={`style-${product.id}`}
    >
      <div className="modal__body">
        <button className="modal__close" type="button" onClick={() => ref.current.close()}>Close</button>
        <h2 id={`style-${product.id}`}>How to style {product.name}</h2>
        <p className="muted">Inspired by {product.character}{collection ? ` from ${collection.name}` : ''}.</p>

        {tips.length > 0 ? (
          <ul className="modal__tips">{tips.map((t) => <li key={t}>{t}</li>)}</ul>
        ) : (
          <p>No styling tips have been added for this piece yet.</p>
        )}

        {partners.length > 0 && (
          <>
            <h3>Wear it with</h3>
            <ul className="modal__pairs">
              {partners.map((p) => (
                <li key={p.id} style={{ '--accent': getCollection(p.collection)?.accent }}>
                  <span className="look__thumb"><Garment category={p.category} colour={p.colours[0].hex} /></span>
                  <span className="look__name">{p.name}</span>
                  <span>{formatPrice(p.price)}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <Link className="btn" to={`/build?start=${product.id}`}>Build a fit with this</Link>
      </div>
    </dialog>
  )
}
