export const FREE_DELIVERY_AT = 3000
export const DELIVERY_FEE = 99

// Free delivery on orders of 3000 or more. An empty cart has no delivery charge.
export const deliveryFor = (subtotal) =>
  subtotal === 0 || subtotal >= FREE_DELIVERY_AT ? 0 : DELIVERY_FEE
