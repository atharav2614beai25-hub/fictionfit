import { Link, useParams } from 'react-router-dom'
import { useActivity } from '../context/ActivityContext.jsx'
import { formatPrice } from '../utils/formatPrice.js'

export default function OrderConfirmation() {
  const { id } = useParams()
  const { orders } = useActivity()
  const order = orders.find((o) => o.id === id)

  if (!order) {
    return (
      <section className="soon">
        <h1>Order not found</h1>
        <p>We could not find an order with the number {id}.</p>
        <Link className="btn" to="/">Back to home</Link>
      </section>
    )
  }
  return (
    <section className="page">
      <h1 className="page__title">Order {order.id} recorded</h1>
      <p className="notice">This was a simulated order. No payment was taken and nothing will be shipped.</p>
      <div className="cart">
        <div>
          <h2>Delivery details</h2>
          <p>{order.customer.name}</p>
          <p>{order.customer.address}, {order.customer.city} {order.customer.pin}</p>
          <p className="muted">{order.customer.email}, {order.customer.phone}</p>
          <p className="muted">Placed {order.date}</p>
          <Link className="btn" to="/explore">Keep shopping</Link>
        </div>
        <aside className="summary">
          <h2>Items</h2>
          <ul className="sumlist">
            {order.lines.map((l, i) => (
              <li key={i}>
                <div><p>{l.name}</p><p className="muted">{l.colour}, {l.size}, qty {l.qty}</p></div>
                <p>{formatPrice(l.price * l.qty)}</p>
              </li>
            ))}
          </ul>
          <dl className="facts">
            <dt>Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd>
            <dt>Delivery</dt><dd>{order.delivery === 0 ? 'Free' : formatPrice(order.delivery)}</dd>
            <dt>Total</dt><dd><strong>{formatPrice(order.total)}</strong></dd>
          </dl>
        </aside>
      </div>
    </section>
  )
}
