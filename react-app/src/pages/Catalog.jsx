import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, Navigate } from "react-router-dom"
import FieldMessage from "../components/FieldMessage"
import { useAuth } from "../context/AuthContext"
import { useShelf } from "../context/ShelfContext"
import { api } from "../lib/api"
import { formatRwf } from "../lib/money"
import { productCreateSchema, productUpdateSchema } from "../lib/schemas"

const fieldClass = "mt-1 w-full rounded-xl border border-[#d7e0dc] px-3 py-2 font-normal"

const emptyProduct = {
  name: "",
  category: "",
  unit: "",
  price: "",
}

export default function Catalog() {
  const { token, user, logout } = useAuth()
  const { reload } = useShelf()
  const [products, setProducts] = useState([])
  const [editingId, setEditingId] = useState("")
  const [notice, setNotice] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(editingId ? productUpdateSchema : productCreateSchema),
    defaultValues: emptyProduct,
  })

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

  async function saveProduct(values) {
    setError("")
    setNotice("")
    const body = new FormData()
    body.append("name", values.name)
    body.append("category", values.category)
    body.append("unit", values.unit)
    body.append("price", values.price)
    const file = values.image?.[0]
    if (file) body.append("image", file)

    try {
      const result = editingId
        ? await api(`/api/products/${editingId}`, { token, method: "PUT", form: body })
        : await api("/api/products", { token, method: "POST", form: body })
      setNotice(editingId ? "Product updated." : "Product added.")
      setEditingId("")
      reset(emptyProduct)
      await reload()
      await loadProducts()
      if (!result?.message) setNotice("Saved")
    } catch (err) {
      handleAuthError(err)
    }
  }

  function startEdit(product) {
    setEditingId(product._id)
    reset({
      name: product.name || "",
      category: product.category || "",
      unit: product.unit || "",
      price: String(product.price ?? ""),
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
        reset(emptyProduct)
      }
      setNotice("Product removed.")
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
      <form onSubmit={handleSubmit(saveProduct)} className="h-fit space-y-4 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-black/5" noValidate>
        <h1 className="text-2xl font-extrabold text-[#12312e]">{editingId ? "Edit product" : "Add a product"}</h1>
        <label className="block text-sm font-semibold">
          Name
          <input className={fieldClass} {...register("name")} />
          <FieldMessage error={errors.name} />
        </label>
        <label className="block text-sm font-semibold">
          Category
          <input placeholder="Vegetables, Fruit, Dairy..." className={fieldClass} {...register("category")} />
          <FieldMessage error={errors.category} />
        </label>
        <label className="block text-sm font-semibold">
          Unit
          <input placeholder="1 kg, 400 g, 1 cup" className={fieldClass} {...register("unit")} />
          <FieldMessage error={errors.unit} />
        </label>
        <label className="block text-sm font-semibold">
          Price (RWF)
          <input inputMode="decimal" className={fieldClass} {...register("price")} />
          <FieldMessage error={errors.price} />
        </label>
        <label className="block text-sm font-semibold">
          Image {editingId ? "(optional)" : ""}
          <input type="file" accept="image/*" className={fieldClass} {...register("image")} />
          <FieldMessage error={errors.image} />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-[#0e4a45] px-4 py-3 font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : editingId ? "Save changes" : "Add product"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId("")
              reset(emptyProduct)
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
                <p className="text-sm text-[#5d6b68]">
                  {product.category}
                  {product.unit ? ` · ${product.unit}` : ""}
                </p>
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
