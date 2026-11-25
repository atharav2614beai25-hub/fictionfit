import { Link } from 'react-router-dom'
import { collections } from '../data/collections.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__brand">
        <p className="footer__logo">FictionFit</p>
        <p>Original designs inspired by anime, series and films. Not official merchandise and not affiliated with any studio or rights holder.</p>
      </div>
      <nav aria-label="Collections">
        <h2 className="footer__h">Collections</h2>
        {collections.map((c) => (
          <Link key={c.id} to={`/collection/${c.id}`}>{c.name}</Link>
        ))}
      </nav>
      <nav aria-label="Shop">
        <h2 className="footer__h">Shop</h2>
        <Link to="/explore">Explore everything</Link>
        <Link to="/build">Build a fit</Link>
        <Link to="/quiz">Style quiz</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/admin">Admin demo</Link>
      </nav>
      <p className="footer__note">College project. Checkout and admin are simulations.</p>
    </footer>
  )
}
