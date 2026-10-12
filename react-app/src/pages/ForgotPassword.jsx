import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ForgotPassword() {
  const { forgotPassword } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function onSubmit(event) {
    event.preventDefault()
    const email = String(new FormData(event.currentTarget).get("email") || "")
    setError("")
    setPending(true)
    try {
      const result = await forgotPassword(email)
      navigate("/reset-password", { state: { email, message: result.message } })
    } catch (err) {
      setError(err.message || "Could not send a reset code")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5">
      <h1 className="text-3xl font-extrabold text-[#12312e]">Reset your password</h1>
      <p className="mt-2 text-sm text-[#5d6b68]">
        We email a 6-digit code if this address has a Selz account.
      </p>
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
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-2xl bg-[#0e4a45] py-3 font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Sending code..." : "Send reset code"}
        </button>
      </form>
      <p className="mt-4 text-sm text-[#5d6b68]">
        <Link to="/login" className="font-semibold text-[#0e4a45]">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
