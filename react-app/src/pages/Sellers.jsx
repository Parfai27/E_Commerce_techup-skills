import { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const fieldClass = "mt-1 w-full rounded-xl border border-[#d7e0dc] px-3 py-2 font-normal"

export default function Sellers() {
  const { user, createSeller } = useAuth()
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [notice, setNotice] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== "admin") return <Navigate to="/account" replace />

  async function onSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setNotice("")
    setError("")
    try {
      const data = await createSeller(form.name, form.email, form.password)
      setNotice(data.message || "Seller created")
      setForm({ name: "", email: "", password: "" })
    } catch (err) {
      setError(err.message || "Could not create the seller")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5">
      <h1 className="text-3xl font-extrabold text-[#12312e]">Create a seller</h1>
      <p className="mt-2 text-sm text-[#5d6b68]">
        New accounts from the register page stay buyers. Only an admin can add a seller.
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
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
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-semibold">
          Password
          <input
            required
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            className={fieldClass}
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-2xl bg-[#0e4a45] px-4 py-3 font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Creating..." : "Create seller"}
        </button>
      </form>
      {notice && <p className="mt-4 text-sm font-semibold text-[#0e4a45]">{notice}</p>}
      {error && <p className="mt-4 text-sm font-semibold text-red-700">{error}</p>}
      <Link to="/account" className="mt-6 inline-block text-sm font-semibold text-[#0e4a45]">
        Back to account
      </Link>
    </div>
  )
}
