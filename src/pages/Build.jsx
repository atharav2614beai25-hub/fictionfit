import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Garment from '../components/Garment.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useActivity } from '../context/ActivityContext.jsx'
import { getCollection } from '../data/collections.js'
import { formatPrice } from '../utils/formatPrice.js'

// Each slot accepts certain categories. An outfit has at most one item per slot.
const slots = [
  { key: 'top', label: 'Top', categories: ['tshirt', 'hoodie', 'jacket', 'coat'] },
  { key: 'bottom', label: 'Bottoms', categories: ['cargo'] },
  { key: 'shoes', label: 'Shoes', categories: ['shoes'] },
  { key: 'accessory', label: 'Accessory', categories: ['accessory'] },
]
const empty = { top: null, bottom: null, shoes: null, accessory: null }

export default function Build() {
  const { products, getProduct } = useProducts()
  const { add } = useCart()
  const { looks, saveLook, deleteLook } = useActivity()
  const [params] = useSearchParams()

  // picks looks like { top: { id: 'ff-001', size: 'M' }, bottom: null, ... }
  const [picks, setPicks] = useState(() => {
    const start = getProduct(params.get('start'))          // /build?start=ff-001 pre-fills one slot
    const slot = start && slots.find((s) => s.categories.includes(start.category))
    return slot ? { ...empty, [slot.key]: { id: start.id, size: start.sizes[0] } } : empty
  })
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const chosen = slots
    .map((s) => ({ slot: s, pick: picks[s.key], product: picks[s.key] ? getProduct(picks[s.key].id) : null }))
    .filter((c) => c.product)
  const total = chosen.reduce((sum, c) => sum + c.product.price, 0)   // recalculated on every render

  const choose = (slotKey, product) =>
    setPicks((prev) => ({
      ...prev,
      [slotKey]: prev[slotKey]?.id === product.id ? null : { id: product.id, size: product.sizes[0] },  // click again to remove
    }))
  const changeSize = (slotKey, size) => setPicks((prev) => ({ ...prev, [slotKey]: { ...prev[slotKey], size } }))
  const removeSlot = (slotKey) => setPicks((prev) => ({ ...prev, [slotKey]: null }))

  const handleSave = () => {
    if (chosen.length === 0) { setMessage('Pick at least one item before saving.'); return }
    saveLook({ name: name.trim() || `Look ${looks.length + 1}`, picks })
    setName('')
    setMessage('Look saved.')
  }
  const addAll = () => {
    if (chosen.length === 0) { setMessage('Pick at least one item first.'); return }
    chosen.forEach((c) => add(c.product, c.product.colours[0].name, c.pick.size, 1))
    setMessage(`Added ${chosen.length} items to your cart in their first colour.`)
  }
  const lookTotal = (look) =>
    Object.values(look.picks).filter(Boolean).reduce((sum, p) => sum + (getProduct(p.id)?.price ?? 0), 0)

  return (
    <section className="page">
      <h1 className="page__title">Build your fit</h1>
      <p className="page__lead">Choose one piece for each slot. Click a selected piece again to remove it.</p>

      <div className="build">
        <div className="build__slots">
          {slots.map((s) => {
            const options = products.filter((p) => s.categories.includes(p.category))
            return (
              <fieldset key={s.key} className="slot">
                <legend>{s.label}</legend>
                <div className="slot__options">
                  {options.map((p) => (
                    <button key={p.id} type="button" disabled={p.stock === 0}
                      className={`opt ${picks[s.key]?.id === p.id ? 'is-on' : ''}`}
                      aria-pressed={picks[s.key]?.id === p.id}
                      style={{ '--accent': getCollection(p.collection)?.accent }}
                      onClick={() => choose(s.key, p)}>
                      <span className="look__thumb"><Garment category={p.category} colour={p.colours[0].hex} /></span>
                      <span className="opt__name">{p.name}</span>
                      <span>{p.stock === 0 ? 'Sold out' : formatPrice(p.price)}</span>
                    </button>
                  ))}
                  {options.length === 0 && <p className="muted">No pieces in this slot yet.</p>}
                </div>
              </fieldset>
            )
          })}
        </div>

        <aside className="summary" aria-label="Outfit summary">
          <h2>Your outfit</h2>
          {chosen.length === 0 ? (
            <p className="muted">Nothing chosen yet.</p>
          ) : (
            <ul className="sumlist">
              {chosen.map((c) => (
                <li key={c.slot.key}>
                  <div>
                    <strong>{c.slot.label}</strong>
                    <p>{c.product.name}</p>
                    <label className="muted">Size{' '}
                      <select value={c.pick.size} onChange={(e) => changeSize(c.slot.key, e.target.value)}>
                        {c.product.sizes.map((sz) => <option key={sz}>{sz}</option>)}
                      </select>
                    </label>
                  </div>
                  <div className="cline__end">
                    <p>{formatPrice(c.product.price)}</p>
                    <button type="button" className="textlink" onClick={() => removeSlot(c.slot.key)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="build__total">Total {formatPrice(total)}</p>

          <label className="field">
            <span>Name this look</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Night run" maxLength={30} />
          </label>
          <button type="button" className="btn" onClick={handleSave}>Save look</button>
          <button type="button" className="btn btn--ghost" onClick={addAll}>Add outfit to cart</button>
          <button type="button" className="textlink" onClick={() => { setPicks(empty); setMessage('') }}>Start over</button>
          <p role="status" className="muted">{message}</p>
        </aside>
      </div>

      <h2 className="section__title build__saved">Saved looks</h2>
      {looks.length === 0 ? (
        <p className="muted">You have not saved a look yet.</p>
      ) : (
        <ul className="looks">
          {looks.map((l) => (
            <li key={l.id}>
              <span><strong>{l.name}</strong> <span className="muted">{formatPrice(lookTotal(l))}</span></span>
              <span>
                <button type="button" className="textlink" onClick={() => setPicks(l.picks)}>Load</button>{' '}
                <button type="button" className="textlink" onClick={() => deleteLook(l.id)}>Delete</button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
