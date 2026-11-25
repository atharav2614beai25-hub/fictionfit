import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCollection } from '../data/collections.js'
import { useProducts } from '../context/ProductsContext.jsx'
import ProductBrowser from '../components/ProductBrowser.jsx'

export default function Collection() {
  const { id } = useParams()
  const { products } = useProducts()
  const collection = getCollection(id)
  const items = useMemo(() => products.filter((p) => p.collection === id), [products, id])

  if (!collection) {
    return (
      <section className="soon">
        <h1>Collection not found</h1>
        <p>No collection has the address "{id}".</p>
        <Link className="btn" to="/explore">Browse everything</Link>
      </section>
    )
  }
  const s = collection.source

  return (
    <div style={{ '--accent': collection.accent, '--panel': collection.panel }}>
      <header className="banner" data-theme={collection.id}>
        <p>{collection.kind}</p>
        <h1 className="banner__title">{collection.name}</h1>
        <p className="banner__tag">{collection.tagline}</p>
      </header>

      <div className="about">
        <section>
          <h2>About the show</h2>
          <p>{s.premise}</p>
          <dl className="facts">
            <dt>Type</dt><dd>{s.medium}</dd>
            <dt>Created by</dt><dd>{s.creator}</dd>
            <dt>Made by</dt><dd>{s.producer}</dd>
            <dt>Years</dt><dd>{s.years}</dd>
          </dl>
        </section>
        <section>
          <h2>What they wear</h2>
          <ul className="outfits">
            {collection.looks.map((l) => (
              <li key={l.who}><strong>{l.who}</strong><span>{l.outfit}</span></li>
            ))}
          </ul>
        </section>
      </div>

      <section className="section">
        <h2 className="section__title">Pieces inspired by {collection.name}</h2>
        <ProductBrowser items={items} />
      </section>
    </div>
  )
}
