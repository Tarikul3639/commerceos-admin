import { z } from "zod"

const attributeValueSchema = z.object({
    value: z
        .string()
        .min(1, "Value is required")
        .max(100, "Value must not exceed 100 characters"),
})

export const createAttributeSchema = z.object({
    name: z
        .string()
        .min(2, "Attribute name must be at least 2 characters")
        .max(100, "Attribute name must not exceed 100 characters"),

    values: z.array(attributeValueSchema),
})

export type CreateAttributeFormValues = z.infer<typeof createAttributeSchema>
