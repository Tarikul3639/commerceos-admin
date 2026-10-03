import { z } from "zod"

export const discountFormSchema = z
  .object({
    productId: z.string().min(1, "Choose a product"),
    value: z.string().min(1, "Enter a discount percentage"),
    startDate: z.string(),
    endDate: z.string(),
  })
  .superRefine((values, context) => {
    const value = Number(values.value)
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      context.addIssue({
        code: "custom",
        path: ["value"],
        message: "Discount must be between 0 and 100",
      })
    }

    if (
      values.startDate &&
      values.endDate &&
      values.endDate < values.startDate
    ) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be on or after the start date",
      })
    }
  })

export type DiscountFormValues = z.infer<typeof discountFormSchema>
