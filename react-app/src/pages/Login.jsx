import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useLocation, useNavigate } from "react-router-dom"
import FieldMessage from "../components/FieldMessage"
import { useAuth } from "../context/AuthContext"
import { loginSchema } from "../lib/schemas"

const fieldClass = "mt-1 w-full rounded-2xl border border-[#d7e0dc] px-4 py-3 font-normal"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const notice = location.state?.message || ""
  const [error, setError] = useState("")
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(values) {
    setError("")
    try {
      await login(values.email, values.password)
      navigate("/")
    } catch (err) {
      setError(err.message || "Could not sign in")
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5">
      <h1 className="text-3xl font-extrabold text-[#12312e]">Sign in to Selz</h1>
      {notice && <p className="mt-3 text-sm font-semibold text-[#0e4a45]">{notice}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <label className="block text-sm font-semibold">
          Email
          <input type="email" autoComplete="email" className={fieldClass} {...register("email")} />
          <FieldMessage error={errors.email} />
        </label>
        <label className="block text-sm font-semibold">
          Password
          <input type="password" autoComplete="current-password" className={fieldClass} {...register("password")} />
          <FieldMessage error={errors.password} />
        </label>
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-[#0e4a45] py-3 font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
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
