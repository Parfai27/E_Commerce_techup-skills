import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import FieldMessage from "../components/FieldMessage"
import { useAuth } from "../context/AuthContext"
import { registerSchema } from "../lib/schemas"

const fieldClass = "mt-1 w-full rounded-2xl border border-[#d7e0dc] px-4 py-3 font-normal"

export default function Register() {
  const { register: registerAccount } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  })

  async function onSubmit(values) {
    setError("")
    try {
      const result = await registerAccount(values.name, values.email, values.password)
      navigate("/login", { state: { message: result.message } })
    } catch (err) {
      setError(err.message || "Could not create the account")
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5">
      <h1 className="text-3xl font-extrabold text-[#12312e]">Create a Selz account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <label className="block text-sm font-semibold">
          Name
          <input autoComplete="name" className={fieldClass} {...register("name")} />
          <FieldMessage error={errors.name} />
        </label>
        <label className="block text-sm font-semibold">
          Email
          <input type="email" autoComplete="email" className={fieldClass} {...register("email")} />
          <FieldMessage error={errors.email} />
        </label>
        <label className="block text-sm font-semibold">
          Password
          <input type="password" autoComplete="new-password" className={fieldClass} {...register("password")} />
          <FieldMessage error={errors.password} />
        </label>
        <label className="block text-sm font-semibold">
          Confirm password
          <input type="password" autoComplete="new-password" className={fieldClass} {...register("confirmPassword")} />
          <FieldMessage error={errors.confirmPassword} />
        </label>
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-[#0e4a45] py-3 font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
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
