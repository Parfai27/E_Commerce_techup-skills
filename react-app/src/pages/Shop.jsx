import { useEffect, useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useSearchParams } from "react-router-dom"
import FieldMessage from "../components/FieldMessage"
import ProductCard from "../components/ProductCard"
import { useShelf } from "../context/ShelfContext"
import { priceFilterSchema } from "../lib/schemas"

const PAGE_SIZE = 8

function updateParam(params, key, value) {
  const next = new URLSearchParams(params)
  if (value) next.set(key, value)
  else next.delete(key)
  if (key !== "page") next.delete("page")
  return next
}

export default function Shop() {
  const { products, categories } = useShelf()
  const [params, setParams] = useSearchParams()
  const q = params.get("q") || ""
  const category = params.get("category") || ""
  const min = params.get("min") || ""
  const max = params.get("max") || ""
  const sort = params.get("sort") || "name"
  const page = Math.max(1, Number(params.get("page") || "1"))

  const filtered = useMemo(() => {
    const minPrice = min === "" ? null : Number(min)
    const maxPrice = max === "" ? null : Number(max)
    const query = q.trim().toLowerCase()

    const matched = products.filter((product) => {
      if (query && !product.name.toLowerCase().includes(query)) return false
      if (category && product.category !== category) return false
      if (minPrice !== null && Number.isFinite(minPrice) && product.price < minPrice) return false
      if (maxPrice !== null && Number.isFinite(maxPrice) && product.price > maxPrice) return false
      return true
    })

    matched.sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price
      if (sort === "price-desc") return b.price - a.price
      if (sort === "category") return a.category.localeCompare(b.category)
      return a.name.localeCompare(b.name)
    })
    return matched
  }, [products, q, category, min, max, sort])

  const {
    register: registerPrice,
    handleSubmit: submitPrice,
    reset: resetPrice,
    formState: { errors: priceErrors },
  } = useForm({
    resolver: zodResolver(priceFilterSchema),
    defaultValues: { min, max },
  })

  useEffect(() => {
    resetPrice({ min, max })
  }, [min, max, resetPrice])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div>
      <p className="text-sm text-[#5d6b68]">Home / Shop</p>
      <h1 className="mt-1 text-3xl font-extrabold text-[#12312e]">Shop</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit space-y-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div>
            <p className="text-sm font-bold text-[#12312e]">Category</p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <button
                type="button"
                onClick={() => setParams(updateParam(params, "category", ""))}
                className={`text-left ${category === "" ? "font-bold text-[#0e4a45]" : "text-[#3e524e]"}`}
              >
                All
              </button>
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setParams(updateParam(params, "category", item))}
                  className={`text-left ${category === item ? "font-bold text-[#0e4a45]" : "text-[#3e524e]"}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <form
            className="space-y-3"
            noValidate
            onSubmit={submitPrice((values) => {
              const next = updateParam(params, "min", values.min.trim())
              setParams(updateParam(next, "max", values.max.trim()))
            })}
          >
            <p className="text-sm font-bold text-[#12312e]">Price (RWF)</p>
            <div className="grid grid-cols-2 gap-2">
              <input
                inputMode="numeric"
                placeholder="Min"
                className="rounded-xl border border-[#d7e0dc] px-3 py-2 text-sm"
                {...registerPrice("min")}
              />
              <input
                inputMode="numeric"
                placeholder="Max"
                className="rounded-xl border border-[#d7e0dc] px-3 py-2 text-sm"
                {...registerPrice("max")}
              />
            </div>
            <FieldMessage error={priceErrors.min || priceErrors.max} />
            <button
              type="submit"
              className="w-full rounded-xl bg-[#0e4a45] py-2 text-sm font-semibold text-white"
            >
              Apply
            </button>
          </form>
        </aside>
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[#5d6b68]">
              {filtered.length} products
              {q ? ` for “${q}”` : ""}
            </p>
            <label className="text-sm text-[#3e524e]">
              Sort{" "}
              <select
                value={sort}
                onChange={(event) => setParams(updateParam(params, "sort", event.target.value))}
                className="ml-1 rounded-xl border border-[#d7e0dc] bg-white px-3 py-2"
              >
                <option value="name">Name</option>
                <option value="price-asc">Price, low to high</option>
                <option value="price-desc">Price, high to low</option>
                <option value="category">Category</option>
              </select>
            </label>
          </div>
          {visible.length === 0 ? (
            <p className="rounded-3xl bg-white p-8 text-[#3e524e]">No products match those filters.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          {pageCount > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
                <button
                  key={number}
                  type="button"
                  onClick={() => setParams(updateParam(params, "page", String(number)))}
                  className={`h-10 w-10 rounded-full text-sm font-semibold ${
                    number === currentPage ? "bg-[#0e4a45] text-white" : "bg-white text-[#12312e]"
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
