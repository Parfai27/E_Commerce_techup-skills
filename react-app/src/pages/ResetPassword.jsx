import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useLocation, useNavigate } from "react-router-dom"
import FieldMessage from "../components/FieldMessage"
import { useAuth } from "../context/AuthContext"
import { resetPasswordSchema } from "../lib/schemas"

const fieldClass = "mt-1 w-full rounded-2xl border border-[#d7e0dc] px-4 py-3 font-normal"

export default function ResetPassword() {
  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState("")
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: location.state?.email || "",
      code: "",
      newPassword: "",
    },
  })

  async function onSubmit(values) {
    setError("")
    try {
      const result = await resetPassword(values.email, values.code, values.newPassword)
      navigate("/login", { state: { message: result.message } })
    } catch (err) {
      setError(err.message || "Could not reset the password")
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5">
      <h1 className="text-3xl font-extrabold text-[#12312e]">Enter your reset code</h1>
      <p className="mt-2 text-sm text-[#5d6b68]">
        {location.state?.message || "Use the code from your email. It expires in 10 minutes."}
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <label className="block text-sm font-semibold">
          Email
          <input type="email" autoComplete="email" className={fieldClass} {...register("email")} />
          <FieldMessage error={errors.email} />
        </label>
        <label className="block text-sm font-semibold">
          Code
          <input inputMode="numeric" autoComplete="one-time-code" className={fieldClass} {...register("code")} />
          <FieldMessage error={errors.code} />
        </label>
        <label className="block text-sm font-semibold">
          New password
          <input type="password" autoComplete="new-password" className={fieldClass} {...register("newPassword")} />
          <FieldMessage error={errors.newPassword} />
        </label>
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-[#0e4a45] py-3 font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Save new password"}
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
