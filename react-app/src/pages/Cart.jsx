import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { formatRwf } from "../lib/money"

export default function Cart() {
  const { lines, total, setQty, remove } = useCart()

  if (lines.length === 0) {
    return (
      <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5">
        <h1 className="text-3xl font-extrabold text-[#12312e]">Your cart is empty</h1>
        <Link to="/shop" className="mt-4 inline-block font-semibold text-[#0e4a45]">
          Browse the shop
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-[#12312e]">Cart</h1>
      <p className="mt-2 text-sm text-[#5d6b68]">Saved in this browser.</p>
      <ul className="mt-6 space-y-4">
        {lines.map((line) => (
          <li
            key={line.id}
            className="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5 sm:flex-row sm:items-center"
          >
            <img
              src={line.product.image}
              alt=""
              className="h-24 w-24 rounded-2xl object-cover"
            />
            <div className="flex-1">
              <Link to={`/product/${line.product.id}`} className="font-semibold text-[#12312e]">
                {line.product.name}
              </Link>
              <p className="text-sm text-[#5d6b68]">
                {formatRwf(line.product.price)} · {line.product.unit}
              </p>
            </div>
            <input
              type="number"
              min="1"
              value={line.qty}
              onChange={(event) => setQty(line.id, Math.max(1, Number(event.target.value) || 1))}
              className="w-20 rounded-xl border border-[#d7e0dc] px-3 py-2"
              aria-label={`Quantity for ${line.product.name}`}
            />
            <p className="w-28 font-bold text-[#0e4a45]">{formatRwf(line.lineTotal)}</p>
            <button
              type="button"
              onClick={() => remove(line.id)}
              className="text-sm font-semibold text-[#8a3b32]"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-right text-2xl font-extrabold text-[#12312e]">
        Total {formatRwf(total)}
      </p>
    </div>
  )
}
