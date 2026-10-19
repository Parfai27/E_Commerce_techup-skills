import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import FieldMessage from "../components/FieldMessage"
import { useAuth } from "../context/AuthContext"
import { forgotPasswordSchema } from "../lib/schemas"

const fieldClass = "mt-1 w-full rounded-2xl border border-[#d7e0dc] px-4 py-3 font-normal"

export default function ForgotPassword() {
  const { forgotPassword } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values) {
    setError("")
    try {
      const result = await forgotPassword(values.email)
      navigate("/reset-password", { state: { email: values.email, message: result.message } })
    } catch (err) {
      setError(err.message || "Could not send a reset code")
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5">
      <h1 className="text-3xl font-extrabold text-[#12312e]">Reset your password</h1>
      <p className="mt-2 text-sm text-[#5d6b68]">
        We email a 6-digit code if this address has a Selz account.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <label className="block text-sm font-semibold">
          Email
          <input type="email" autoComplete="email" className={fieldClass} {...register("email")} />
          <FieldMessage error={errors.email} />
        </label>
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-[#0e4a45] py-3 font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? "Sending code..." : "Send reset code"}
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
