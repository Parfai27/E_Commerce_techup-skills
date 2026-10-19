import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { categories as builtInCategories, products as builtInProducts } from "../data/products"

const ShelfContext = createContext(null)

function knownCategory(name) {
  const trimmed = String(name || "").trim()
  const match = builtInCategories.find((category) => category.toLowerCase() === trimmed.toLowerCase())
  return match || trimmed || "Other"
}

function toShelfProduct(record) {
  return {
    id: String(record._id),
    name: String(record.name || "").trim(),
    unit: String(record.unit || "").trim(),
    category: knownCategory(record.category),
    price: Number(record.price) || 0,
    image: record.imageUrl,
  }
}

export function ShelfProvider({ children }) {
  const [added, setAdded] = useState([])

  const reload = useCallback(async () => {
    try {
      const response = await fetch("/api/products")
      if (!response.ok) return
      const data = await response.json()
      if (!Array.isArray(data)) return
      const localNames = new Set(builtInProducts.map((product) => product.name.toLowerCase()))
      setAdded(
        data
          .map(toShelfProduct)
          .filter((product) => product.name && product.image && !localNames.has(product.name.toLowerCase())),
      )
    } catch {
      setAdded([])
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const value = useMemo(() => {
    const products = [...builtInProducts, ...added]
    const categories = [...new Set(products.map((product) => product.category))]
    return {
      products,
      added,
      categories,
      reload,
      getProduct(id) {
        return products.find((product) => product.id === id)
      },
      categoryCount(category) {
        return products.filter((product) => product.category === category).length
      },
    }
  }, [added, reload])

  return <ShelfContext.Provider value={value}>{children}</ShelfContext.Provider>
}

export function useShelf() {
  const context = useContext(ShelfContext)
  if (!context) throw new Error("useShelf must be used inside ShelfProvider")
  return context
}
