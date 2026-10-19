import { z } from "zod"

const name = z.string().trim().min(1, "Name is required")
const email = z.string().trim().email("Enter a valid email")
const password = z.string().min(6, "Password must be at least 6 characters")

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
})

export const registerSchema = z
  .object({
    name,
    email,
    password,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const forgotPasswordSchema = z.object({
  email,
})

export const resetPasswordSchema = z.object({
  email,
  code: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code"),
  newPassword: password,
})

export const sellerSchema = z.object({
  name,
  email,
  password,
})

const price = z
  .string()
  .trim()
  .min(1, "Price is required")
  .refine((value) => {
    const amount = Number(value)
    return Number.isFinite(amount) && amount > 0
  }, "Enter a price greater than 0")

const productFields = {
  name,
  category: z.string().trim().min(1, "Category is required"),
  unit: z.string().trim().min(1, "Unit is required"),
  price,
}

function imageField(required) {
  return z.any().refine(
    (value) => !required || (typeof FileList !== "undefined" && value instanceof FileList && value.length > 0),
    "Product image is required",
  )
}

export const productCreateSchema = z.object({
  ...productFields,
  image: imageField(true),
})

export const productUpdateSchema = z.object({
  ...productFields,
  image: imageField(false),
})

export const priceFilterSchema = z
  .object({
    min: z.string(),
    max: z.string(),
  })
  .superRefine((data, ctx) => {
    const min = data.min.trim()
    const max = data.max.trim()
    const minNumber = Number(min)
    const maxNumber = Number(max)
    if (min && !Number.isFinite(minNumber)) {
      ctx.addIssue({ code: "custom", path: ["min"], message: "Enter a number" })
    }
    if (max && !Number.isFinite(maxNumber)) {
      ctx.addIssue({ code: "custom", path: ["max"], message: "Enter a number" })
    }
    if (min && max && Number.isFinite(minNumber) && Number.isFinite(maxNumber) && minNumber > maxNumber) {
      ctx.addIssue({ code: "custom", path: ["max"], message: "Max must be at least the minimum" })
    }
  })
