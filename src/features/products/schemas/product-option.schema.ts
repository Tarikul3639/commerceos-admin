import { z } from "zod"

export const PRODUCT_OPTION_TYPES = [
    "COLOR",
    "SIZE",
    "MATERIAL",
    "STYLE",
    "CUSTOM",
] as const

export const productOptionValueSchema = z.object({
    value: z
        .string()
        .trim()
        .min(1, "Value is required")
        .max(50, "Value must be 50 characters or less"),
    colorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color"),
})

export const productOptionSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Option name is required")
        .max(50, "Option name must be 50 characters or less"),
    type: z.enum(PRODUCT_OPTION_TYPES),
    values: z
        .array(productOptionValueSchema)
        .min(1, "Add at least one value")
        .superRefine((values, ctx) => {
            const seen = new Set<string>()

            for (const item of values) {
                const key = item.value.trim().toLowerCase()

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
