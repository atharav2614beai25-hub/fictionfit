import { useState } from 'react'
import Garment from './Garment.jsx'

// 1. If product.image is set and loads, show the real photo.
// 2. Otherwise draw the garment illustration in the product's first colour.
// The background colour comes from --accent, which the parent sets per collection.
export default function ProductImage({ product }) {
  const [failed, setFailed] = useState(false)

  if (product.image && !failed) {
    return (
      <img className="pimg" src={product.image} alt={product.name}
        loading="lazy" onError={() => setFailed(true)} />
    )
  }
  return (
    <div className="pimg art" role="img" aria-label={`${product.name}, illustration`}>
      <Garment category={product.category} colour={product.colours[0].hex} />
      <span className="art__char">{product.character}</span>
    </div>
  )
}
