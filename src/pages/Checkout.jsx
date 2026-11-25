import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import { useActivity } from '../context/ActivityContext.jsx'
import { formatPrice } from '../utils/formatPrice.js'

const sample = { name: 'Aarav Sharma', email: 'aarav@example.com', phone: '9876543210',
  address: '12 Sample Street, Model Town', city: 'Amritsar', pin: '143001' }

function validate(v) {
  const e = {}
  if (v.name.trim().length < 2) e.name = 'Enter your full name.'
  if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = 'Enter a valid email address.'
  if (!/^[6-9]\d{9}$/.test(v.phone)) e.phone = 'Enter a 10-digit mobile number starting with 6 to 9.'
  if (v.address.trim().length < 8) e.address = 'Enter your full address.'
  if (v.city.trim().length < 2) e.city = 'Enter your city.'
  if (!/^\d{6}$/.test(v.pin)) e.pin = 'Enter a 6-digit PIN code.'
  return e
}

// Defined outside Checkout so React does not recreate it on every keystroke.
function Field({ label, name, value, error, onChange, ...rest }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input name={name} value={value} onChange={onChange} aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-err` : undefined} {...rest} />
      {error && <small id={`${name}-err`} className="err">{error}</small>}
    </label>
  )
}

export default function Checkout() {
  const navigate = useNavigate()
  const { items, subtotal, delivery, total, clear } = useCart()
  const { reduceStock } = useProducts()
  const { addOrder } = useActivity()
  const [values, setValues] = useState({ name: '', email: '', phone: '', address: '', city: '', pin: '' })
  const [errors, setErrors] = useState({})

  if (items.length === 0) {
    return (
      <section className="soon">
        <h1>Nothing to check out</h1>
        <p>Your cart is empty.</p>
        <Link className="btn" to="/explore">Start shopping</Link>
      </section>
    )
  }

  const onChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    const order = {
      id: `FF-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleString('en-IN'),
      customer: values,
      lines: items.map((i) => ({ name: i.product.name, colour: i.colour, size: i.size, qty: i.qty, price: i.product.price })),
      subtotal, delivery, total,
      status: 'Simulated (no payment taken)',
    }
    reduceStock(items.map((i) => ({ productId: i.productId, qty: i.qty })))
    addOrder(order)
    navigate(`/order/${order.id}`)
    clear()
  }

  return (
    <section className="page">
      <h1 className="page__title">Checkout</h1>
      <p className="notice">This is a simulation. No payment is collected and no real order is placed. Do not enter real card details.</p>

      <div className="cart">
        <form className="form" onSubmit={submit} noValidate>
          <button type="button" className="textlink" onClick={() => { setValues(sample); setErrors({}) }}>Fill sample details</button>
          <Field label="Full name" name="name" value={values.name} error={errors.name} onChange={onChange} autoComplete="name" />
          <Field label="Email" name="email" type="email" value={values.email} error={errors.email} onChange={onChange} autoComplete="email" />
          <Field label="Mobile number" name="phone" inputMode="numeric" maxLength={10} value={values.phone} error={errors.phone} onChange={onChange} autoComplete="tel" />
          <Field label="Address" name="address" value={values.address} error={errors.address} onChange={onChange} autoComplete="street-address" />
          <Field label="City" name="city" value={values.city} error={errors.city} onChange={onChange} />
          <Field label="PIN code" name="pin" inputMode="numeric" maxLength={6} value={values.pin} error={errors.pin} onChange={onChange} />
          <p className="muted">Payment: pay on delivery (simulated).</p>
          <button className="btn" type="submit">Place simulated order</button>
        </form>

        <aside className="summary" aria-label="Order summary">
          <h2>Order summary</h2>
          <ul className="sumlist">
            {items.map((i) => (
              <li key={i.key}>
                <div><p>{i.product.name}</p><p className="muted">{i.colour}, {i.size}, qty {i.qty}</p></div>
                <p>{formatPrice(i.product.price * i.qty)}</p>
              </li>
            ))}
          </ul>
          <dl className="facts">
            <dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd>
            <dt>Delivery</dt><dd>{delivery === 0 ? 'Free' : formatPrice(delivery)}</dd>
            <dt>Total</dt><dd><strong>{formatPrice(total)}</strong></dd>
          </dl>
        </aside>
      </div>
    </section>
  )
}
