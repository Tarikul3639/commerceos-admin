import { z } from "zod"

export const categorySchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must not exceed 100 characters"),

    slug: z
        .string()
        .min(2, "Slug must be at least 2 characters")
        .max(150, "Slug must not exceed 150 characters")
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug must contain only lowercase letters, numbers, and hyphens"
        ),

    description: z
        .string()
        .max(1000, "Description must not exceed 1000 characters")
        .optional()
        .or(z.literal("")),

    isActive: z.boolean(),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
