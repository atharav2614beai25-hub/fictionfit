import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { collections, getCollection } from '../data/collections.js'
import { useProducts } from '../context/ProductsContext.jsx'
import ProductCard from '../components/ProductCard.jsx'
import RecentlyViewed from '../components/RecentlyViewed.jsx'
import Garment from '../components/Garment.jsx'

const lines = ['Wear', 'the story.']

export default function Home() {
  const reduce = useReducedMotion()
  const { products } = useProducts()
  const newDrops = products.filter((p) => p.isNew).slice(0, 4)
  const trending = products.filter((p) => p.isTrending).slice(0, 4)
  const countIn = (id) => products.filter((p) => p.collection === id).length

  return (
    <>
      <section className="hero">
        <div className="hero__text">
          <h1 className="hero__title" aria-label="Wear the story.">
            {lines.map((line, i) => (
              <span className="hero__mask" key={line} aria-hidden="true">
                <motion.span className="hero__line"
                  initial={reduce ? false : { y: '105%' }} animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.15, ease: [0.2, 0.7, 0.2, 1] }}>
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <p className="hero__sub">
            Hoodies, coats, cargos and full outfits inspired by the characters you watch on repeat.
            Original designs, never official merch.
          </p>
          <div className="hero__actions">
            <Link className="btn" to="/explore">Shop the drop</Link>
            <Link className="btn btn--ghost" to="/build">Build a fit</Link>
          </div>
        </div>
        <ul className="hero__strip" aria-label="Collections">
          {collections.map((c) => (
            <li key={c.id} style={{ '--accent': c.accent, '--panel': c.panel }}>
              <Link to={`/collection/${c.id}`}><span>{c.name}</span></Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2 className="section__title">Five universes, five moods</h2>
        <div className="coll-grid">
          {collections.map((c) => (
            <Link key={c.id} to={`/collection/${c.id}`} className="coll" style={{ '--accent': c.accent, '--panel': c.panel }}>
              <span className="coll__kind">{c.kind}</span>
              <span className="coll__name">{c.name}</span>
              <span className="coll__tag">{c.tagline}</span>
              <span className="coll__count">{countIn(c.id)} pieces</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <h2 className="section__title">New drops</h2>
          <Link className="textlink" to="/explore">See all pieces</Link>
        </div>
        <div className="pgrid">{newDrops.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </section>

      <section className="section">
        <h2 className="section__title">Trending now</h2>
        <div className="pgrid">{trending.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </section>

      <section className="look">
        <div className="look__copy">
          <h2>Not sure what goes with what?</h2>
          <p>Pick a top, bottoms, shoes and an accessory. The price adds up as you go, and you can save the look.</p>
          <Link className="btn" to="/build">Start building</Link>
        </div>
        <ul className="look__list">
          {products.slice(0, 3).map((p) => (
            <li key={p.id} style={{ '--accent': getCollection(p.collection)?.accent }}>
              <span className="look__thumb"><Garment category={p.category} colour={p.colours[0].hex} /></span>
              <span className="look__name">{p.name}</span>
              <span>{p.character}</span>
            </li>
          ))}
        </ul>
      </section>

      <RecentlyViewed />
    </>
  )
}
