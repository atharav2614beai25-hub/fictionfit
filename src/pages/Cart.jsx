import { Link } from 'react-router-dom'
import Garment from '../components/Garment.jsx'
import { useCart } from '../context/CartContext.jsx'
import { getCollection } from '../data/collections.js'
import { formatPrice } from '../utils/formatPrice.js'
import { FREE_DELIVERY_AT } from '../utils/pricing.js'

export default function Cart() {
  const { items, subtotal, delivery, total, setQty, remove, clear } = useCart()

  if (items.length === 0) {
    return (
      <section className="soon">
        <h1>Your cart is empty</h1>
        <p>Add a piece you like and it will wait here, even if you refresh.</p>
        <Link className="btn" to="/explore">Start shopping</Link>
      </section>
    )
  }

  return (
    <section className="page">
      <h1 className="page__title">Your cart</h1>
      <div className="cart">
        <ul className="cart__lines">
          {items.map((i) => {
            const p = i.product
            const hex = (p.colours.find((c) => c.name === i.colour) ?? p.colours[0]).hex
            return (
              <li key={i.key} className="cline" style={{ '--accent': getCollection(p.collection)?.accent }}>
                <span className="look__thumb"><Garment category={p.category} colour={hex} /></span>
                <div className="cline__info">
                  <Link to={`/product/${p.id}`}>{p.name}</Link>
                  <p className="muted">{i.colour}, size {i.size}</p>
                  <div className="qty">
                    <button type="button" aria-label="Decrease quantity" disabled={i.qty <= 1} onClick={() => setQty(i.key, i.qty - 1)}>−</button>
                    <output>{i.qty}</output>
                    <button type="button" aria-label="Increase quantity" disabled={i.qty >= p.stock} onClick={() => setQty(i.key, i.qty + 1)}>+</button>
                  </div>
                </div>
                <div className="cline__end">
                  <p>{formatPrice(p.price * i.qty)}</p>
                  <button type="button" className="textlink" onClick={() => remove(i.key)}>Remove</button>
                </div>
              </li>
            )
          })}
        </ul>

        <aside className="summary" aria-label="Order summary">
          <h2>Summary</h2>
          <dl className="facts">
            <dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd>
            <dt>Delivery</dt><dd>{delivery === 0 ? 'Free' : formatPrice(delivery)}</dd>
            <dt>Total</dt><dd><strong>{formatPrice(total)}</strong></dd>
          </dl>
          {delivery > 0 && <p className="muted">Free delivery on orders of {formatPrice(FREE_DELIVERY_AT)} or more.</p>}
          <Link className="btn" to="/checkout">Go to checkout</Link>
          <button type="button" className="textlink" onClick={clear}>Empty cart</button>
        </aside>
      </div>
    </section>
  )
}
