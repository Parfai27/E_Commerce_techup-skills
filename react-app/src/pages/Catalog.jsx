import { useEffect, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useShelf } from "../context/ShelfContext"
import { api } from "../lib/api"
import { formatRwf } from "../lib/money"

const fieldClass = "mt-1 w-full rounded-xl border border-[#d7e0dc] px-3 py-2 font-normal"

const emptyForm = {
  name: "",
  category: "",
  price: "",
  image: null,
}

export default function Catalog() {
  const { token, user, logout } = useAuth()
  const { reload } = useShelf()
  const [products, setProducts] = useState([])
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

  async function loadProducts() {
    setLoading(true)
    setError("")
    try {
      const list = await api("/api/products", { token })
      setProducts(Array.isArray(list) ? list : [])
    } catch (err) {
      handleAuthError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token && user?.role === "seller") loadProducts()
  }, [token, user?.role])

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
      setNotice(editingId ? "Product updated. It is on the shop shelves." : "Product added to the shop.")
      setForm(emptyForm)
      setEditingId("")
      event.target.reset()
      await reload()
      await loadProducts()
      if (!result?.message) setNotice("Saved")
    } catch (err) {
      handleAuthError(err)
    } finally {
      setSaving(false)
    }
  }

  function startEdit(product) {
    setEditingId(product._id)
    setForm({
      name: product.name || "",
      category: product.category || "",
      price: String(product.price ?? ""),
      image: null,
    })
    setNotice("")
    setError("")
  }

  async function removeProduct(id) {
    setError("")
    setNotice("")
    try {
      await api(`/api/products/${id}`, { token, method: "DELETE" })
      if (editingId === id) {
        setEditingId("")
        setForm(emptyForm)
      }
      setNotice("Product removed from the shop.")
      await reload()
      await loadProducts()
    } catch (err) {
      handleAuthError(err)
    }
  }

  if (!token) {
    return (
      <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5">
        <h1 className="text-3xl font-extrabold text-[#12312e]">My products</h1>
        <p className="mt-2 text-sm text-[#5d6b68]">Sign in as a seller to add products.</p>
        <Link to="/login" className="mt-4 inline-block font-semibold text-[#0e4a45]">
          Sign in
        </Link>
      </div>
    )
  }

  if (user?.role !== "seller") return <Navigate to={user?.role === "admin" ? "/sellers" : "/account"} replace />

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <form onSubmit={saveProduct} className="h-fit space-y-4 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-black/5">
        <h1 className="text-2xl font-extrabold text-[#12312e]">{editingId ? "Edit product" : "Add a product"}</h1>
        <p className="text-sm text-[#5d6b68]">New products appear on the shop with the other groceries.</p>
        <label className="block text-sm font-semibold">
          Name
          <input
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-semibold">
          Category
          <input
            required
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
            placeholder="Vegetables, Fruit, Dairy..."
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-semibold">
          Price (RWF)
          <input
            required
            value={form.price}
            onChange={(event) => setForm({ ...form, price: event.target.value })}
            inputMode="decimal"
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-semibold">
          Image {editingId ? "(optional)" : ""}
          <input
            required={!editingId}
            type="file"
            accept="image/*"
            onChange={(event) => setForm({ ...form, image: event.target.files?.[0] || null })}
            className={fieldClass}
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-2xl bg-[#0e4a45] px-4 py-3 font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : editingId ? "Save changes" : "Add product"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId("")
              setForm(emptyForm)
            }}
            className="w-full text-sm font-semibold text-[#0e4a45]"
          >
            Cancel edit
          </button>
        )}
        {notice && <p className="text-sm font-semibold text-[#0e4a45]">{notice}</p>}
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
      </form>

      <section>
        <h2 className="text-2xl font-extrabold text-[#12312e]">Your products</h2>
        <p className="mt-1 text-sm text-[#5d6b68]">Only the products you added. Buyers see them on the shop.</p>
        {loading && <p className="mt-4 text-sm text-[#5d6b68]">Loading your products...</p>}
        {!loading && products.length === 0 && (
          <p className="mt-4 rounded-3xl bg-white p-6 text-sm text-[#5d6b68]">You have not added a product yet.</p>
        )}
        <div className="mt-4 space-y-3">
          {products.map((product) => (
            <article key={product._id} className="flex gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
              <img src={product.imageUrl} alt="" className="h-20 w-20 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[#12312e]">{product.name}</p>
                <p className="text-sm text-[#5d6b68]">{product.category}</p>
                <p className="font-bold text-[#0e4a45]">{formatRwf(product.price)}</p>
              </div>
              <div className="flex flex-col justify-center gap-2 text-sm font-semibold">
                <button type="button" onClick={() => startEdit(product)} className="text-[#0e4a45]">
                  Edit
                </button>
                <button type="button" onClick={() => removeProduct(product._id)} className="text-[#8a3b32]">
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
