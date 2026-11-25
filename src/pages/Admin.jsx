import { useState } from 'react'
import { useProducts } from '../context/ProductsContext.jsx'
import { useActivity } from '../context/ActivityContext.jsx'
import { collections } from '../data/collections.js'
import { formatPrice } from '../utils/formatPrice.js'

const categories = ['hoodie', 'tshirt', 'jacket', 'coat', 'cargo', 'shoes', 'accessory']
const blank = { name: '', price: '', stock: '', category: 'hoodie', collection: collections[0].id,
  character: '', description: '', sizes: 'S, M, L, XL', colourName: '', colourHex: '#222222', tags: '', image: '' }
const list = (text) => text.split(',').map((s) => s.trim()).filter(Boolean)

function validate(v) {
  const e = {}
  if (v.name.trim().length < 3) e.name = 'Name needs at least 3 characters.'
  if (!Number.isInteger(Number(v.price)) || Number(v.price) <= 0) e.price = 'Price must be a whole number above 0.'
  if (v.stock === '' || !Number.isInteger(Number(v.stock)) || Number(v.stock) < 0) e.stock = 'Stock must be a whole number, 0 or more.'
  if (v.character.trim().length < 2) e.character = 'Enter the inspiring character.'
  if (v.description.trim().length < 10) e.description = 'Description needs at least 10 characters.'
  if (list(v.sizes).length === 0) e.sizes = 'Enter at least one size, separated by commas.'
  if (v.colourName.trim() === '') e.colourName = 'Enter a colour name.'
  if (!/^#[0-9a-f]{6}$/i.test(v.colourHex)) e.colourHex = 'Use a hex colour like #1a2b3c.'
  if (v.image.trim() && !/^(https?:\/\/|\/)/.test(v.image.trim())) e.image = 'Image must start with http, https or /.'
  return e
}

export default function Admin() {
  const { products, addProduct, updateProduct, deleteProduct, resetProducts } = useProducts()
  const { orders } = useActivity()
  const [tab, setTab] = useState('products')
  const [form, setForm] = useState(blank)
  const [editingId, setEditingId] = useState(null)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const startEdit = (p) => {
    setEditingId(p.id)
    setErrors({})
    setForm({ name: p.name, price: String(p.price), stock: String(p.stock), category: p.category,
      collection: p.collection, character: p.character, description: p.description,
      sizes: p.sizes.join(', '), colourName: p.colours[0].name, colourHex: p.colours[0].hex,
      tags: p.tags.join(', '), image: p.image ?? '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const cancel = () => { setEditingId(null); setForm(blank); setErrors({}) }

  const submit = (e) => {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) { setStatus('Fix the highlighted fields.'); return }

    const data = {
      name: form.name.trim(), price: Number(form.price), stock: Number(form.stock),
      category: form.category, collection: form.collection, character: form.character.trim(),
      description: form.description.trim(), sizes: list(form.sizes),
      colours: [{ name: form.colourName.trim(), hex: form.colourHex }],
      tags: list(form.tags), image: form.image.trim() || null,
    }
    if (editingId) { updateProduct(editingId, data); setStatus(`Updated ${data.name}.`) }
    else { addProduct(data); setStatus(`Added ${data.name}.`) }
    cancel()
  }

  const remove = (p) => {
    if (window.confirm(`Delete "${p.name}"? This cannot be undone.`)) {
      deleteProduct(p.id)
      setStatus(`Deleted ${p.name}.`)
      if (editingId === p.id) cancel()
    }
  }

  // A plain function (not a component), so inputs keep focus while you type.
  const field = (label, name, extra = {}) => (
    <label className="field">
      <span>{label}</span>
      <input name={name} value={form[name]} onChange={onChange} aria-invalid={Boolean(errors[name])} {...extra} />
      {errors[name] && <small className="err">{errors[name]}</small>}
    </label>
  )

  return (
    <section className="page">
      <h1 className="page__title">Admin demo</h1>
      <p className="notice">Frontend demo only. There is no login and no secure backend, so anyone who opens this page can edit the data. Changes live in this browser (localStorage).</p>

      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'products'} onClick={() => setTab('products')}>Products ({products.length})</button>
        <button role="tab" aria-selected={tab === 'orders'} onClick={() => setTab('orders')}>Orders ({orders.length})</button>
      </div>
      <p role="status" className="muted">{status}</p>

      {tab === 'products' ? (
        <>
          <form className="form form--grid" onSubmit={submit} noValidate>
            <h2>{editingId ? 'Edit product' : 'Add a product'}</h2>
            {field('Name', 'name')}
            {field('Price (INR)', 'price', { inputMode: 'numeric' })}
            {field('Stock', 'stock', { inputMode: 'numeric' })}
            <label className="field"><span>Category</span>
              <select name="category" value={form.category} onChange={onChange}>{categories.map((c) => <option key={c}>{c}</option>)}</select>
            </label>
            <label className="field"><span>Collection</span>
              <select name="collection" value={form.collection} onChange={onChange}>{collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            </label>
            {field('Inspiring character', 'character')}
            {field('Description', 'description')}
            {field('Sizes (comma separated)', 'sizes')}
            {field('Colour name', 'colourName')}
            {field('Colour hex', 'colourHex')}
            {field('Tags (comma separated)', 'tags')}
            {field('Image URL (optional)', 'image')}
            <div className="form__buttons">
              <button className="btn" type="submit">{editingId ? 'Save changes' : 'Add product'}</button>
              {editingId && <button className="btn btn--ghost" type="button" onClick={cancel}>Cancel</button>}
            </div>
          </form>

          <div className="tablewrap">
            <table>
              <thead><tr><th>Name</th><th>Collection</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{collections.find((c) => c.id === p.collection)?.name}</td>
                    <td>{formatPrice(p.price)}</td>
                    <td>
                      <input type="number" min="0" aria-label={`Stock for ${p.name}`} value={p.stock}
                        onChange={(e) => updateProduct(p.id, { stock: Math.max(0, Number(e.target.value) || 0) })} />
                    </td>
                    <td>
                      <button className="textlink" type="button" onClick={() => startEdit(p)}>Edit</button>{' '}
                      <button className="textlink" type="button" onClick={() => remove(p)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="textlink" type="button" onClick={() => {
            if (window.confirm('Reset all products to the original demo data?')) { resetProducts(); setStatus('Products reset.') }
          }}>Reset demo data</button>
        </>
      ) : orders.length === 0 ? (
        <div className="empty"><p>No simulated orders yet. Place one from the checkout page.</p></div>
      ) : (
        <div className="tablewrap">
          <table>
            <thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td><td>{o.date}</td><td>{o.customer.name}</td>
                  <td>{o.lines.reduce((s, l) => s + l.qty, 0)}</td><td>{formatPrice(o.total)}</td><td>{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
