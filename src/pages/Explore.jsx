import { useProducts } from '../context/ProductsContext.jsx'
import ProductBrowser from '../components/ProductBrowser.jsx'

export default function Explore() {
  const { products } = useProducts()
  return (
    <section className="page">
      <h1 className="page__title">Explore</h1>
      <p className="page__lead">Browse by anime, series or film, or search for a character.</p>
      <ProductBrowser items={products} showCollections />
    </section>
  )
}
