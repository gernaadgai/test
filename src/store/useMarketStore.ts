import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Order } from '../types'
import { PRODUCTS } from '../data/products'

interface MarketState {
  cart: CartItem[]
  orders: Order[]
  // Simulated parent wallet — display-only, no real money or payment processing.
  parentWalletMnt: number
  childAllowanceMnt: number

  addToCart: (productId: string) => void
  removeFromCart: (productId: string) => void
  setQty: (productId: string, qty: number) => void
  clearCart: () => void
  placeOrder: () => Order
  setParentWallet: (mnt: number) => void
  setChildAllowance: (mnt: number) => void
}

export const useMarketStore = create<MarketState>()(
  persist(
    (set, get) => ({
      cart: [],
      orders: [],
      parentWalletMnt: 50000,
      childAllowanceMnt: 10000,

      addToCart: (productId) => {
        const cart = get().cart
        const existing = cart.find((i) => i.productId === productId)
        if (existing) {
          set({ cart: cart.map((i) => (i.productId === productId ? { ...i, qty: i.qty + 1 } : i)) })
        } else {
          set({ cart: [...cart, { productId, qty: 1 }] })
        }
      },

      removeFromCart: (productId) => set({ cart: get().cart.filter((i) => i.productId !== productId) }),

      setQty: (productId, qty) => {
        if (qty <= 0) {
          set({ cart: get().cart.filter((i) => i.productId !== productId) })
        } else {
          set({ cart: get().cart.map((i) => (i.productId === productId ? { ...i, qty } : i)) })
        }
      },

      clearCart: () => set({ cart: [] }),

      placeOrder: () => {
        const cart = get().cart
        const totalMnt = cart.reduce((sum, item) => {
          const product = PRODUCTS.find((p) => p.id === item.productId)
          return sum + (product?.priceMnt ?? 0) * item.qty
        }, 0)
        const order: Order = {
          id: `ORD-${Date.now().toString(36).toUpperCase()}`,
          items: cart,
          totalMnt,
          placedAt: new Date().toISOString(),
          status: 'confirmed',
        }
        set({ orders: [order, ...get().orders], cart: [] })
        return order
      },

      setParentWallet: (mnt) => set({ parentWalletMnt: Math.max(0, mnt) }),
      setChildAllowance: (mnt) => set({ childAllowanceMnt: Math.max(0, mnt) }),
    }),
    { name: 'ger-naadgai-market' },
  ),
)

export function cartTotal(cart: CartItem[]) {
  return cart.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.productId)
    return sum + (product?.priceMnt ?? 0) * item.qty
  }, 0)
}

export function formatMnt(amount: number) {
  return `₮${amount.toLocaleString('en-US')}`
}
