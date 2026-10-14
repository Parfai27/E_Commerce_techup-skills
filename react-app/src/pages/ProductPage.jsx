import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import { useShelf } from "../context/ShelfContext"
import { formatRwf } from "../lib/money"

export default function ProductPage() {
  const { id } = useParams()
  const { getProduct } = useShelf()
  const { user } = useAuth()
  const product = getProduct(id)
  const { add } = useCart()
  const staff = user?.role === "seller" || user?.role === "admin"
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <div className="rounded-3xl bg-white p-8">
        <p className="text-lg font-semibold">That product is not on the shelf.</p>
        <Link to="/shop" className="mt-4 inline-block font-semibold text-[#0e4a45]">
          Back to the shop
        </Link>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-[#5d6b68]">
        <Link to="/shop">Shop</Link> / {product.category}
      </p>
      <div className="mt-4 grid gap-8 rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-black/5 md:grid-cols-2 md:p-8">
        <img
          src={product.image}
          alt={product.name}
          className="aspect-square w-full rounded-3xl object-cover"
        />
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#6b7c78]">
            {product.category}
          </p>
          <h1 className="mt-2 text-4xl font-extrabold text-[#12312e]">{product.name}</h1>
          {product.unit ? <p className="mt-2 text-[#5d6b68]">Sold by {product.unit}</p> : null}
          <p className="mt-4 text-3xl font-bold text-[#0e4a45]">{formatRwf(product.price)}</p>
          <p className="mt-3 max-w-md text-sm text-[#5d6b68]">
            {product.unit
              ? "Typical Kigali retail for 2026, from supermarket shelves and city markets."
              : "Added by a Selz seller."}
          </p>
          {staff ? null : (
            <>
              <div className="mt-6 flex items-center gap-3">
                <label className="text-sm font-semibold" htmlFor="qty">
                  Qty
                </label>
                <input
                  id="qty"
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(event) => setQty(Math.max(1, Number(event.target.value) || 1))}
                  className="w-20 rounded-xl border border-[#d7e0dc] px-3 py-2"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  add(product.id, qty)
                  setAdded(true)
                }}
                className="mt-5 w-full rounded-2xl bg-[#0e4a45] py-3 font-semibold text-white hover:bg-[#0a3330] sm:w-auto sm:px-8"
              >
                Add to cart
              </button>
              {added && (
                <p className="mt-3 text-sm font-semibold text-[#0e4a45]">
                  Added. Your cart stays in this browser.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
