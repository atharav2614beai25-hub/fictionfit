import { ProductsProvider } from './ProductsContext.jsx'
import { CartProvider } from './CartContext.jsx'
import { WishlistProvider } from './WishlistContext.jsx'
import { ActivityProvider } from './ActivityContext.jsx'
import { TransitionProvider } from './TransitionContext.jsx'

// Order matters: Cart reads from Products, so Products wraps Cart.
export default function AppProviders({ children }) {
  return (
    <ProductsProvider>
      <CartProvider>
        <WishlistProvider>
          <ActivityProvider>
            <TransitionProvider>{children}</TransitionProvider>
          </ActivityProvider>
        </WishlistProvider>
      </CartProvider>
    </ProductsProvider>
  )
}
