import { getCollection } from '../data/collections.js'

export const defaultFilters = {
  category: 'all', kind: 'all', collection: 'all',
  maxPrice: 0, size: 'all', tag: 'all', sort: 'popular',
}

const sorters = {
  popular: (a, b) => b.popularity - a.popularity,
  low: (a, b) => a.price - b.price,
  high: (a, b) => b.price - a.price,
}

// items: array of products. f: filters plus f.q (the search text).
export function filterProducts(items, f) {
  const q = f.q.trim().toLowerCase()

  const list = items.filter((p) => {
    const c = getCollection(p.collection)
    if (q) {
      const text = [p.name, p.character, c?.name, p.category, ...p.tags].join(' ').toLowerCase()
      if (!text.includes(q)) return false
    }
    if (f.category !== 'all' && p.category !== f.category) return false
    if (f.kind !== 'all' && c?.kind !== f.kind) return false
    if (f.collection !== 'all' && p.collection !== f.collection) return false
    if (f.maxPrice && p.price > f.maxPrice) return false
    if (f.size !== 'all' && !p.sizes.includes(f.size)) return false
    if (f.tag !== 'all' && !p.tags.includes(f.tag)) return false
    return true
  })

  return [...list].sort(sorters[f.sort])   // copy first so we never change the original
}
