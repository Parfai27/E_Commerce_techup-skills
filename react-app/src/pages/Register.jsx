import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function onSubmit(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setError("")
    setPending(true)
    try {
      const result = await register(
        String(data.get("name") || ""),
        String(data.get("email") || ""),
        String(data.get("password") || ""),
      )
      navigate("/login", { state: { message: result.message } })
    } catch (err) {
      setError(err.message || "Could not create the account")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5">
      <h1 className="text-3xl font-extrabold text-[#12312e]">Create a Selz account</h1>
      <p className="mt-2 text-sm text-[#5d6b68]">
        Name, email, and password are saved on the API.
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-semibold">
          Name
          <input
            name="name"
            required
            autoComplete="name"
            className="mt-1 w-full rounded-2xl border border-[#d7e0dc] px-4 py-3 font-normal"
          />
        </label>
        <label className="block text-sm font-semibold">
          Email
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded-2xl border border-[#d7e0dc] px-4 py-3 font-normal"
          />
        </label>
        <label className="block text-sm font-semibold">
          Password
          <input
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="mt-1 w-full rounded-2xl border border-[#d7e0dc] px-4 py-3 font-normal"
          />
        </label>
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-2xl bg-[#0e4a45] py-3 font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="mt-4 text-sm text-[#5d6b68]">
        Already registered?{" "}
        <Link to="/login" className="font-semibold text-[#0e4a45]">
          Sign in
        </Link>
      </p>
    </div>
  )
}
