import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ResetPassword() {
  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function onSubmit(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setError("")
    setPending(true)
    try {
      const result = await resetPassword(
        String(data.get("email") || ""),
        String(data.get("code") || ""),
        String(data.get("newPassword") || ""),
      )
      navigate("/login", { state: { message: result.message } })
    } catch (err) {
      setError(err.message || "Could not reset the password")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5">
      <h1 className="text-3xl font-extrabold text-[#12312e]">Enter your reset code</h1>
      <p className="mt-2 text-sm text-[#5d6b68]">
        {location.state?.message || "Use the code from your email. It expires in 10 minutes."}
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-semibold">
          Email
          <input
            name="email"
            type="email"
            required
            defaultValue={location.state?.email || ""}
            autoComplete="email"
            className="mt-1 w-full rounded-2xl border border-[#d7e0dc] px-4 py-3 font-normal"
          />
        </label>
        <label className="block text-sm font-semibold">
          Code
          <input
            name="code"
            inputMode="numeric"
            required
            autoComplete="one-time-code"
            className="mt-1 w-full rounded-2xl border border-[#d7e0dc] px-4 py-3 font-normal"
          />
        </label>
        <label className="block text-sm font-semibold">
          New password
          <input
            name="newPassword"
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
          {pending ? "Saving..." : "Save new password"}
        </button>
      </form>
      <p className="mt-4 text-sm text-[#5d6b68]">
        <Link to="/forgot-password" className="font-semibold text-[#0e4a45]">
          Send another code
        </Link>
      </p>
    </div>
  )
}
