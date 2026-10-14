import { createContext, useContext, useMemo, useState } from "react"
import { useShelf } from "./ShelfContext"

const CartContext = createContext(null)
const CART_KEY = "selz_cart"

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]")
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const { getProduct } = useShelf()
  const [lines, setLines] = useState(readCart)

  function write(next) {
    setLines(next)
    localStorage.setItem(CART_KEY, JSON.stringify(next))
  }

  const value = useMemo(() => {
    const detailed = lines
      .map((line) => {
        const product = getProduct(line.id)
        if (!product) return null
        return { ...line, product, lineTotal: product.price * line.qty }
      })
      .filter(Boolean)

    return {
      lines: detailed,
      count: detailed.reduce((sum, line) => sum + line.qty, 0),
      total: detailed.reduce((sum, line) => sum + line.lineTotal, 0),
      add(id, qty = 1) {
        const current = readCart()
        const existing = current.find((line) => line.id === id)
        const next = existing
          ? current.map((line) =>
              line.id === id ? { ...line, qty: line.qty + qty } : line,
            )
          : [...current, { id, qty }]
        write(next)
      },
      setQty(id, qty) {
        const next = readCart()
          .map((line) => (line.id === id ? { ...line, qty } : line))
          .filter((line) => line.qty > 0)
        write(next)
      },
      remove(id) {
        write(readCart().filter((line) => line.id !== id))
      },
      clear() {
        write([])
      },
    }
  }, [lines, getProduct])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used inside CartProvider")
  return context
}
