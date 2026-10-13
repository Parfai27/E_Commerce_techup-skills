import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { api, readProducts } from "../lib/api"

const fieldClass = "mt-1 w-full rounded-xl border border-[#d7e0dc] px-3 py-2 font-normal"

const emptyForm = {
  name: "",
  category: "",
  price: "",
  image: null,
}

function money(value) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return "—"
  return amount.toLocaleString("en-US")
}

export default function Catalog() {
  const { token, user, logout } = useAuth()
  const canManage = user?.role === "admin" || user?.role === "seller"
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState(null)
  const [stats, setStats] = useState([])
  const [filters, setFilters] = useState({
    q: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
  })
  const [draft, setDraft] = useState(filters)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState("")
  const [notice, setNotice] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  function handleAuthError(err) {
    if (err.status === 401) logout()
    setError(err.message || "Request failed")
  }

  async function load(nextFilters = filters) {
    setLoading(true)
    setError("")
    const params = new URLSearchParams()
    if (nextFilters.category) params.set("category", nextFilters.category)
    if (nextFilters.minPrice) params.set("minPrice", nextFilters.minPrice)
    if (nextFilters.maxPrice) params.set("maxPrice", nextFilters.maxPrice)
    if (nextFilters.sortBy) params.set("sortBy", nextFilters.sortBy)
    if (nextFilters.sortOrder) params.set("sortOrder", nextFilters.sortOrder)
    params.set("page", String(nextFilters.page || 1))
    params.set("limit", "8")

    const hasQuery = Boolean(nextFilters.q.trim())
    const path = hasQuery
      ? `/api/products/search?q=${encodeURIComponent(nextFilters.q.trim())}&${params}`
      : `/api/products/browse?${params}`

    try {
      const [list, statsPayload] = await Promise.all([
        api(path, { token }),
        api("/api/products/stats", { token }),
      ])
      const parsed = readProducts(list)
      setProducts(parsed.products)
      setPagination(parsed.pagination)
      setStats(Array.isArray(statsPayload.data) ? statsPayload.data : [])
    } catch (err) {
      handleAuthError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) load(filters)
  }, [token, filters])

  function applyFilters(event) {
    event.preventDefault()
    setFilters({ ...draft, page: 1 })
  }

  async function showAll() {
    setLoading(true)
    setError("")
    try {
      const list = await api("/api/products", { token })
      const parsed = readProducts(list)
      setProducts(parsed.products)
      setPagination(parsed.pagination)
      setDraft({ ...draft, q: "", category: "", minPrice: "", maxPrice: "" })
    } catch (err) {
      handleAuthError(err)
    } finally {
      setLoading(false)
    }
  }

  async function startEdit(id) {
    setError("")
    setNotice("")
    try {
      const product = await api(`/api/products/${id}`, { token })
      setEditingId(product._id)
      setForm({
        name: product.name || "",
        category: product.category || "",
        price: String(product.price ?? ""),
        image: null,
      })
    } catch (err) {
      handleAuthError(err)
    }
  }

  async function saveProduct(event) {
    event.preventDefault()
    setSaving(true)
    setError("")
    setNotice("")
    const category = form.category.trim()
    if (!category) {
      setSaving(false)
      setError("Category is required")
      return
    }
    const body = new FormData()
    body.append("name", form.name.trim())
    body.append("category", category)
    body.append("price", form.price)
    if (form.image) body.append("image", form.image)

    try {
      const result = editingId
        ? await api(`/api/products/${editingId}`, { token, method: "PUT", form: body })
        : await api("/api/products", { token, method: "POST", form: body })
      setNotice(result.message || "Saved")
      setForm(emptyForm)
      setEditingId("")
      event.target.reset()
      await load(filters)
    } catch (err) {
      handleAuthError(err)
    } finally {
      setSaving(false)
    }
  }

  async function removeProduct(id) {
    setError("")
    setNotice("")
    try {
      const result = await api(`/api/products/${id}`, { token, method: "DELETE" })
      setNotice(result.message || "Deleted")
      if (editingId === id) {
        setEditingId("")
        setForm(emptyForm)
      }
      await load(filters)
    } catch (err) {
      handleAuthError(err)
    }
  }

  if (!token) {
    return (
      <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5">
        <h1 className="text-3xl font-extrabold text-[#12312e]">Product catalog</h1>
        <p className="mt-2 text-sm text-[#5d6b68]">Sign in to use the product API.</p>
        <Link to="/login" className="mt-4 inline-block font-semibold text-[#0e4a45]">
          Sign in
        </Link>
      </div>
    )
  }

  if (!canManage) {
    return (
      <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5">
        <h1 className="text-3xl font-extrabold text-[#12312e]">Product catalog</h1>
        <p className="mt-2 text-sm text-[#5d6b68]">
          Buyers can shop and use the cart. Adding products is for sellers.
        </p>
        <Link to="/shop" className="mt-4 inline-block font-semibold text-[#0e4a45]">
          Back to the shop
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-[#12312e]">Product catalog</h1>
        <p className="mt-1 text-sm text-[#5d6b68]">
          Search, filters, stats, and product changes go through the API. The shop shelves stay separate.
        </p>
      </div>

      {stats.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((item) => (
            <article key={item.category} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
              <p className="font-semibold text-[#12312e]">{item.category}</p>
              <p className="mt-1 text-sm text-[#5d6b68]">{item.totalProducts} products</p>
              <p className="text-sm text-[#5d6b68]">
                {money(item.minPrice)} – {money(item.maxPrice)} · avg {money(item.avgPrice)}
              </p>
            </article>
          ))}
        </div>
      )}

      <form onSubmit={applyFilters} className="grid gap-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5 md:grid-cols-3">
        <label className="text-sm font-semibold">
          Search name
          <input
            value={draft.q}
            onChange={(event) => setDraft({ ...draft, q: event.target.value })}
            className={fieldClass}
          />
        </label>
        <label className="text-sm font-semibold">
          Category
          <input
            value={draft.category}
            onChange={(event) => setDraft({ ...draft, category: event.target.value })}
            className={fieldClass}
          />
        </label>
        <label className="text-sm font-semibold">
          Min price
          <input
            value={draft.minPrice}
            onChange={(event) => setDraft({ ...draft, minPrice: event.target.value })}
            inputMode="numeric"
            className={fieldClass}
          />
        </label>
        <label className="text-sm font-semibold">
          Max price
          <input
            value={draft.maxPrice}
            onChange={(event) => setDraft({ ...draft, maxPrice: event.target.value })}
            inputMode="numeric"
            className={fieldClass}
          />
        </label>
        <label className="text-sm font-semibold">
          Sort by
          <select
            value={draft.sortBy}
            onChange={(event) => setDraft({ ...draft, sortBy: event.target.value })}
            className={fieldClass}
          >
            <option value="createdAt">Newest</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="category">Category</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          Order
          <select
            value={draft.sortOrder}
            onChange={(event) => setDraft({ ...draft, sortOrder: event.target.value })}
            className={fieldClass}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </label>
        <div className="flex items-end gap-2 md:col-span-3">
          <button type="submit" className="rounded-xl bg-[#0e4a45] px-4 py-2 text-sm font-semibold text-white">
            Apply
          </button>
          <button type="button" onClick={showAll} className="rounded-xl border border-[#d7e0dc] px-4 py-2 text-sm font-semibold">
            All records
          </button>
        </div>
      </form>

      <form onSubmit={saveProduct} className="grid gap-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5 md:grid-cols-2">
        <p className="font-semibold text-[#12312e] md:col-span-2">
          {editingId ? "Update product" : "Add product"}
        </p>
        <label className="text-sm font-semibold">
          Name
          <input
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className={fieldClass}
          />
        </label>
        <label className="text-sm font-semibold">
          Category
          <input
            required
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
            placeholder="Vegetables, Fruit, Dairy..."
            className={fieldClass}
          />
        </label>
        <label className="text-sm font-semibold">
          Price
          <input
            required
            value={form.price}
            onChange={(event) => setForm({ ...form, price: event.target.value })}
            inputMode="decimal"
            className={fieldClass}
          />
        </label>
        <label className="text-sm font-semibold">
          Image {editingId ? "(optional)" : ""}
          <input
            required={!editingId}
            type="file"
            accept="image/*"
            onChange={(event) => setForm({ ...form, image: event.target.files?.[0] || null })}
            className={fieldClass}
          />
        </label>
        <div className="flex items-center gap-3 md:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#0e4a45] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : editingId ? "Save changes" : "Create product"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId("")
                setForm(emptyForm)
              }}
              className="text-sm font-semibold text-[#0e4a45]"
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>

      {notice && <p className="text-sm font-semibold text-[#0e4a45]">{notice}</p>}
      {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
      {loading && <p className="text-sm text-[#5d6b68]">Loading products...</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        {products.map((product) => (
          <article key={product._id} className="flex gap-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <img src={product.imageUrl} alt="" className="h-24 w-24 rounded-2xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[#12312e]">{product.name}</p>
              <p className="text-sm text-[#5d6b68]">{product.category}</p>
              <p className="font-bold text-[#0e4a45]">{money(product.price)}</p>
              <div className="mt-2 flex gap-3 text-sm font-semibold">
                <button type="button" onClick={() => startEdit(product._id)} className="text-[#0e4a45]">
                  Edit
                </button>
                <button type="button" onClick={() => removeProduct(product._id)} className="text-[#8a3b32]">
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!loading && products.length === 0 && (
        <p className="rounded-3xl bg-white p-6 text-sm text-[#5d6b68]">No API products match.</p>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map((number) => (
            <button
              key={number}
              type="button"
              onClick={() => setFilters({ ...filters, page: number })}
              className={`h-10 w-10 rounded-full text-sm font-semibold ${
                number === pagination.currentPage ? "bg-[#0e4a45] text-white" : "bg-white text-[#12312e]"
              }`}
            >
              {number}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
