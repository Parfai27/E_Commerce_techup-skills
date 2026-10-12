import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const notice = location.state?.message || ""
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function onSubmit(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setError("")
    setPending(true)
    try {
      await login(String(data.get("email") || ""), String(data.get("password") || ""))
      navigate("/")
    } catch (err) {
      setError(err.message || "Could not sign in")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5">
      <h1 className="text-3xl font-extrabold text-[#12312e]">Sign in to Selz</h1>
      <p className="mt-2 text-sm text-[#5d6b68]">
        Uses your account on the Selz API.
      </p>
      {notice && <p className="mt-3 text-sm font-semibold text-[#0e4a45]">{notice}</p>}
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
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
            autoComplete="current-password"
            className="mt-1 w-full rounded-2xl border border-[#d7e0dc] px-4 py-3 font-normal"
          />
        </label>
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-2xl bg-[#0e4a45] py-3 font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="mt-4 text-sm text-[#5d6b68]">
        <Link to="/forgot-password" className="font-semibold text-[#0e4a45]">
          Forgot password
        </Link>
      </p>
      <p className="mt-2 text-sm text-[#5d6b68]">
        New here?{" "}
        <Link to="/register" className="font-semibold text-[#0e4a45]">
          Create an account
        </Link>
      </p>
    </div>
  )
}
