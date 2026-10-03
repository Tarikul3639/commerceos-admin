import { z } from "zod"

export const stockFormSchema = z.object({
    quantity: z
        .string()
        .min(1, "Quantity is required")
        .refine((value) => Number.isInteger(Number(value)), {
            message: "Quantity must be a whole number",
        }),

    reason: z
        .string()
        .optional()
        .refine((value) => !value || value.length >= 3, {
            message: "Reason must be at least 3 characters.",
        }),
})
