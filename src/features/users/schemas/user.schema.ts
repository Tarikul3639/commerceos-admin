import { z } from "zod"

import { Role } from "@/config/roles.config"

export const userSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),

  email: z.string().email("Please enter a valid email address"),

  phone: z
    .string()
    .min(10, "Phone number is too short")
    .max(20, "Phone number is too long")
    .optional()
    .or(z.literal("")),

  avatar: z
    .string()
    .url("Please enter a valid avatar URL")
    .optional()
    .or(z.literal("")),

  publicId: z.string().optional().or(z.literal("")),

  role: z.nativeEnum(Role),
})

export type UserFormValues = z.infer<typeof userSchema>
