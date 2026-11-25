import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from './ProductCard.jsx'
import { collections } from '../data/collections.js'
import { filterProducts, defaultFilters } from '../utils/filterProducts.js'

function Select({ label, value, onChange, options }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([val, text]) => <option key={val} value={val}>{text}</option>)}
      </select>
    </label>
  )
}

// items: the products to browse. showCollections: show anime/series/movie + collection filters.
export default function ProductBrowser({ items, showCollections = false }) {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''                 // search text lives in the URL (?q=...)
  const [filters, setFilters] = useState(defaultFilters)

  const set = (key, value) => setFilters((f) => ({ ...f, [key]: value }))
  const setQ = (value) => setParams(value ? { q: value } : {}, { replace: true })
  const clear = () => { setFilters(defaultFilters); setQ('') }

  // Filter choices come from the items, so they always match the data.
  const categories = useMemo(() => [...new Set(items.map((p) => p.category))], [items])
  const sizes = useMemo(() => [...new Set(items.flatMap((p) => p.sizes))], [items])
  const tags = useMemo(() => [...new Set(items.flatMap((p) => p.tags))].sort(), [items])
  const results = useMemo(() => filterProducts(items, { ...filters, q }), [items, filters, q])
  const active = q !== '' || JSON.stringify(filters) !== JSON.stringify(defaultFilters)

  return (
    <div>
      <div className="filters">
        <label className="field field--wide">
          <span>Search name, character, collection or tag</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. hoodie, Neo, vintage" />
        </label>
        {showCollections && (
          <>
            <Select label="Type" value={filters.kind} onChange={(v) => set('kind', v)}
              options={[['all', 'Anime, series and film'], ['Anime', 'Anime'], ['Series', 'Series'], ['Movie', 'Movies']]} />
            <Select label="Collection" value={filters.collection} onChange={(v) => set('collection', v)}
              options={[['all', 'All collections'], ...collections.map((c) => [c.id, c.name])]} />
          </>
        )}
        <Select label="Category" value={filters.category} onChange={(v) => set('category', v)}
          options={[['all', 'All categories'], ...categories.map((c) => [c, c])]} />
        <Select label="Price" value={filters.maxPrice} onChange={(v) => set('maxPrice', Number(v))}
          options={[[0, 'Any price'], [2000, 'Under ₹2,000'], [4000, 'Under ₹4,000'], [6000, 'Under ₹6,000']]} />
        <Select label="Size" value={filters.size} onChange={(v) => set('size', v)}
          options={[['all', 'Any size'], ...sizes.map((s) => [s, s])]} />
        <Select label="Style" value={filters.tag} onChange={(v) => set('tag', v)}
          options={[['all', 'Any style'], ...tags.map((t) => [t, t])]} />
        <Select label="Sort by" value={filters.sort} onChange={(v) => set('sort', v)}
          options={[['popular', 'Most popular'], ['low', 'Price: low to high'], ['high', 'Price: high to low']]} />
      </div>

      <div className="results__bar">
        <p role="status">{results.length} {results.length === 1 ? 'piece' : 'pieces'} found</p>
        {active && <button type="button" className="textlink" onClick={clear}>Clear filters</button>}
      </div>

      {results.length > 0 ? (
        <div className="pgrid">{results.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      ) : (
        <div className="empty">
          <p>Nothing matches those filters.</p>
          <button type="button" className="btn" onClick={clear}>Clear filters</button>
        </div>
      )}
    </div>
  )
}
