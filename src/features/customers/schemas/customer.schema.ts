import { z } from "zod"

export const customerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),

  email: z.string().email("Please enter a valid email address"),

  phone: z.string().optional().or(z.literal("")),

  avatarUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),

  publicId: z
    .string()
    .max(255, "Public ID must not exceed 255 characters")
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .max(500, "Address must not exceed 500 characters")
    .optional()
    .or(z.literal("")),
})

export type CustomerFormValues = z.infer<typeof customerSchema>
