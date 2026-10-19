import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, Navigate } from "react-router-dom"
import FieldMessage from "../components/FieldMessage"
import { useAuth } from "../context/AuthContext"
import { useShelf } from "../context/ShelfContext"
import { sellerSchema } from "../lib/schemas"

const fieldClass = "mt-1 w-full rounded-xl border border-[#d7e0dc] px-3 py-2 font-normal"

export default function Sellers() {
  const { user, createSeller, listSellers, deleteSeller } = useAuth()
  const { reload } = useShelf()
  const [sellers, setSellers] = useState([])
  const [notice, setNotice] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(sellerSchema),
    defaultValues: { name: "", email: "", password: "" },
  })

  async function load() {
    setLoading(true)
    setError("")
    try {
      setSellers(await listSellers())
    } catch (err) {
      setError(err.message || "Could not load sellers")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.role === "admin") load()
  }, [user?.role])

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== "admin") return <Navigate to="/account" replace />

  async function onSubmit(values) {
    setNotice("")
    setError("")
    try {
      const data = await createSeller(values.name, values.email, values.password)
      setNotice(data.message || "Seller created")
      reset({ name: "", email: "", password: "" })
      await load()
    } catch (err) {
      setError(err.message || "Could not create the seller")
    }
  }

  async function remove(seller) {
    const confirmed = window.confirm(`Remove ${seller.name}? Their products will leave the shop.`)
    if (!confirmed) return
    setNotice("")
    setError("")
    try {
      const data = await deleteSeller(seller._id)
      setNotice(data.message || "Seller removed")
      await reload()
      await load()
    } catch (err) {
      setError(err.message || "Could not remove the seller")
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <section>
        <h1 className="text-3xl font-extrabold text-[#12312e]">Sellers</h1>
        {loading && <p className="mt-4 text-sm text-[#5d6b68]">Loading sellers...</p>}
        {!loading && sellers.length === 0 && (
          <p className="mt-4 rounded-3xl bg-white p-6 text-sm text-[#5d6b68]">No sellers yet.</p>
        )}
        <div className="mt-4 space-y-3">
          {sellers.map((seller) => (
            <article key={seller._id} className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[#12312e]">{seller.name}</p>
                <p className="text-sm text-[#5d6b68]">{seller.email}</p>
              </div>
              <button type="button" onClick={() => remove(seller)} className="text-sm font-semibold text-[#8a3b32]">
                Delete
              </button>
            </article>
          ))}
        </div>
        {notice && <p className="mt-4 text-sm font-semibold text-[#0e4a45]">{notice}</p>}
        {error && <p className="mt-4 text-sm font-semibold text-red-700">{error}</p>}
        <Link to="/account" className="mt-6 inline-block text-sm font-semibold text-[#0e4a45]">
          Back to account
        </Link>
      </section>

      <form onSubmit={handleSubmit(onSubmit)} className="h-fit space-y-4 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-black/5" noValidate>
        <h2 className="text-2xl font-extrabold text-[#12312e]">Add a seller</h2>
        <label className="block text-sm font-semibold">
          Name
          <input className={fieldClass} {...register("name")} />
          <FieldMessage error={errors.name} />
        </label>
        <label className="block text-sm font-semibold">
          Email
          <input type="email" className={fieldClass} {...register("email")} />
          <FieldMessage error={errors.email} />
        </label>
        <label className="block text-sm font-semibold">
          Password
          <input type="password" className={fieldClass} {...register("password")} />
          <FieldMessage error={errors.password} />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-[#0e4a45] px-4 py-3 font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? "Creating..." : "Create seller"}
        </button>
      </form>
    </div>
  )
}
