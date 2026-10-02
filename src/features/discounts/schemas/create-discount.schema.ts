import { z } from "zod"
import { DiscountType } from "../types/discount.types"

export const createDiscountSchema = z.object({
  name: z
    .string()
    .min(2, "Discount name must be at least 2 characters")
    .max(255, "Discount name must not exceed 255 characters"),

  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),

  type: z.enum([DiscountType.PERCENTAGE, DiscountType.FIXED]),

  value: z
    .string()
    .min(1, "Discount value is required")
    .refine((value) => !Number.isNaN(Number(value)), {
      message: "Discount value must be a valid number",
    })
    .refine((value) => Number(value) > 0, {
      message: "Discount value must be greater than 0",
    }),

  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isActive: z.boolean(),
})

export type CreateDiscountFormValues = z.infer<typeof createDiscountSchema>
