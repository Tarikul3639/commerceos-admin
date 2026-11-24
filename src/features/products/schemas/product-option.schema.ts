import { z } from "zod"

export const productOptionValueSchema = z.object({
  id: z.string().min(1),
  label: z
    .string()
    .trim()
    .min(1, "Value is required")
    .max(50, "Value must be 50 characters or less"),
  colorCode: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Invalid color")
    .optional(),
})

export const productOptionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Option name is required")
    .max(50, "Option name must be 50 characters or less"),
  type: z.enum(["COLOR", "SIZE", "STORAGE", "CAPACITY", "CUSTOM"]),
  values: z
    .array(productOptionValueSchema)
    .min(1, "Add at least one value")
    .superRefine((values, ctx) => {
      const seen = new Set<string>()
      for (const item of values) {
        const key = item.label.trim().toLowerCase()
        if (seen.has(key)) {
          ctx.addIssue({
            code: "custom",
            message: "Duplicate option values are not allowed",
          })
          return
        }
        seen.add(key)
      }
    }),
})

export type ProductOptionFormValues = z.infer<typeof productOptionSchema>
