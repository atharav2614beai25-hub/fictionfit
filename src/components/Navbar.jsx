import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [term, setTerm] = useState('')
  const navigate = useNavigate()
  const { count } = useCart()              // updates automatically when the cart changes
  const { ids } = useWishlist()
  const close = () => setOpen(false)

  const search = (e) => {
    e.preventDefault()
    const text = term.trim()
    navigate(text ? `/explore?q=${encodeURIComponent(text)}` : '/explore')
    close()
  }

  return (
    <header className="nav">
      <Link to="/" className="nav__logo" onClick={close}>FictionFit</Link>

      <button className="nav__toggle" aria-expanded={open} aria-controls="nav-menu" onClick={() => setOpen(!open)}>
        {open ? 'Close' : 'Menu'}
      </button>

      <nav id="nav-menu" className={`nav__menu ${open ? 'is-open' : ''}`} aria-label="Main">
        <NavLink to="/explore" onClick={close}>Explore</NavLink>
        <NavLink to="/build" onClick={close}>Build a fit</NavLink>
        <NavLink to="/quiz" onClick={close}>Style quiz</NavLink>
        <span className="nav__spacer" />
        <form className="nav__search" role="search" onSubmit={search}>
          <input type="search" aria-label="Search products" placeholder="Search" value={term}
            onChange={(e) => setTerm(e.target.value)} />
        </form>
        <NavLink to="/wishlist" onClick={close}>Wishlist ({ids.length})</NavLink>
        <NavLink to="/cart" onClick={close}>Cart ({count})</NavLink>
      </nav>
    </header>
  )
}
