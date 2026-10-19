import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import { formatRwf } from "../lib/money"

export default function ProductCard({ product }) {
  const { user } = useAuth()
  const { add } = useCart()
  const staff = user?.role === "seller" || user?.role === "admin"

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
      <Link to={`/product/${product.id}`} className="block bg-[#f3f6f2]">
        <img
          src={product.image}
          alt={product.name}
          className="aspect-square w-full object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7c78]">
            {product.category}
          </p>
          <Link
            to={`/product/${product.id}`}
            className="mt-1 block text-lg font-semibold text-[#12312e] hover:text-[#0e4a45]"
          >
            {product.name}
          </Link>
          <p className="text-sm text-[#5d6b68]">{product.unit || "1 pc"}</p>
        </div>
        <p className="text-xl font-bold text-[#0e4a45]">{formatRwf(product.price)}</p>
        {staff ? null : (
          <button
            type="button"
            onClick={() => add(product.id)}
            className="mt-auto w-full rounded-2xl bg-[#0e4a45] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0a3330]"
          >
            Add to cart
          </button>
        )}
      </div>
    </article>
  )
}
