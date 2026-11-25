import { useState } from 'react'
import ProductCard from '../components/ProductCard.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import { getCollection } from '../data/collections.js'
import { formatPrice } from '../utils/formatPrice.js'

// Answer options. "tags" and "words" are what we compare against product data.
const aesthetics = [
  { key: 'street', label: 'Streetwear', tags: ['streetwear', 'oversized', 'heavyweight'] },
  { key: 'vintage', label: 'Vintage and tailored', tags: ['vintage', 'formal', 'smart-casual'] },
  { key: 'work', label: 'Workwear and utility', tags: ['workwear', 'utility', 'cargo', 'earth tones'] },
  { key: 'minimal', label: 'Minimal and dark', tags: ['minimal', 'graphic', 'layering'] },
]
const genres = [['Anime', 'Anime'], ['Series', 'TV series'], ['Movie', 'Movies']]
const colourPrefs = [
  { key: 'dark', label: 'Black and grey', words: ['black', 'charcoal', 'graphite', 'slate', 'midnight', 'grey'] },
  { key: 'earth', label: 'Earth tones', words: ['olive', 'sand', 'tobacco', 'khaki', 'tweed'] },
  { key: 'bold', label: 'Bold accents', words: ['crimson', 'violet', 'green'] },
]
const budgets = [[0, 'No limit'], [2000, 'Up to ₹2,000'], [4000, 'Up to ₹4,000'], [6000, 'Up to ₹6,000']]

// Each matching rule adds points and a plain-English reason.
function score(product, a) {
  const kind = getCollection(product.collection)?.kind
  const reasons = []
  let points = 0

  a.aesthetic.forEach((key) => {
    const opt = aesthetics.find((o) => o.key === key)
    const hits = opt.tags.filter((t) => product.tags.includes(t))
    if (hits.length) { points += 3; reasons.push(`Fits your ${opt.label.toLowerCase()} taste (${hits.join(', ')}).`) }
  })
  if (a.genre.includes(kind)) {
    points += 3
    reasons.push(`Inspired by ${getCollection(product.collection).name}, which is in your ${kind.toLowerCase()} picks.`)
  }
  a.colour.forEach((key) => {
    const opt = colourPrefs.find((o) => o.key === key)
    const hit = product.colours.find((c) => opt.words.some((w) => c.name.toLowerCase().includes(w)))
    if (hit) { points += 2; reasons.push(`Comes in ${hit.name}, which suits ${opt.label.toLowerCase()}.`) }
  })
  if (a.budget && product.price <= a.budget) { points += 1; reasons.push(`Within your budget (${formatPrice(product.price)}).`) }
  return { product, points, reasons }
}

export default function Quiz() {
  const { products } = useProducts()
  const [answers, setAnswers] = useState({ aesthetic: [], genre: [], colour: [], budget: 0 })
  const [results, setResults] = useState(null)

  const toggle = (field, value) =>
    setAnswers((a) => ({ ...a, [field]: a[field].includes(value) ? a[field].filter((v) => v !== value) : [...a[field], value] }))

  const submit = (e) => {
    e.preventDefault()
    const list = products
      .filter((p) => p.stock > 0 && (!answers.budget || p.price <= answers.budget))
      .map((p) => score(p, answers))
      .filter((r) => r.points > 0)
      .sort((x, y) => y.points - x.points || y.product.popularity - x.product.popularity)
      .slice(0, 6)
    setResults(list)
  }

  // A plain function (not a component), so the checkboxes keep focus while you click them.
  const checks = (field, options) => (
    <div className="checks">
      {options.map(([value, label]) => (
        <label key={value}>
          <input type="checkbox" checked={answers[field].includes(value)} onChange={() => toggle(field, value)} /> {label}
        </label>
      ))}
    </div>
  )

  if (results) {
    return (
      <section className="page">
        <h1 className="page__title">Your matches</h1>
        {results.length === 0 ? (
          <div className="empty">
            <p>Nothing in stock matched those answers. Try picking more options or a higher budget.</p>
          </div>
        ) : (
          <div className="pgrid">
            {results.map((r) => (
              <div key={r.product.id}>
                <ProductCard product={r.product} />
                <ul className="reasons">{r.reasons.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
            ))}
          </div>
        )}
        <button type="button" className="btn btn--ghost quiz__again" onClick={() => setResults(null)}>Change my answers</button>
      </section>
    )
  }

  return (
    <section className="page">
      <h1 className="page__title">Find your style</h1>
      <p className="page__lead">Four quick questions. Tick as many options as you like.</p>
      <form className="quiz" onSubmit={submit}>
        <fieldset><legend>What is your aesthetic?</legend>
          {checks('aesthetic', aesthetics.map((o) => [o.key, o.label]))}
        </fieldset>
        <fieldset><legend>What do you watch?</legend>
          {checks('genre', genres)}
        </fieldset>
        <fieldset><legend>Which colours do you wear?</legend>
          {checks('colour', colourPrefs.map((o) => [o.key, o.label]))}
        </fieldset>
        <fieldset><legend>What is your budget per piece?</legend>
          <div className="checks">
            {budgets.map(([value, label]) => (
              <label key={value}>
                <input type="radio" name="budget" checked={answers.budget === value}
                  onChange={() => setAnswers((a) => ({ ...a, budget: value }))} /> {label}
              </label>
            ))}
          </div>
        </fieldset>
        <button className="btn" type="submit">Show my matches</button>
      </form>
    </section>
  )
}
