import { z } from "zod"

export const discountFormSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(3, "Coupon code must be at least 3 characters")
      .max(50, "Coupon code must not exceed 50 characters")
      .regex(
        /^[A-Za-z0-9_-]+$/,
        "Use only letters, numbers, hyphens or underscores"
      ),
    description: z
      .string()
      .max(500, "Description must not exceed 500 characters"),
    type: z.enum(["PERCENTAGE", "FIXED"]),
    value: z
      .string()
      .min(1, "Discount value is required")
      .refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, {
        message: "Enter a value greater than zero",
      }),
    minOrderAmount: z
      .string()
      .min(1, "Minimum order amount is required")
      .refine((value) => Number.isFinite(Number(value)) && Number(value) >= 0, {
        message: "Minimum order amount cannot be negative",
      }),
    maxDiscountAmount: z.string(),
    startsAt: z.string(),
    endsAt: z.string(),
    usageLimit: z.string(),
    isActive: z.boolean(),
  })
  .superRefine((values, context) => {
    if (values.type === "PERCENTAGE" && Number(values.value) > 100) {
      context.addIssue({
        code: "custom",
        path: ["value"],
        message: "Percentage cannot exceed 100",
      })
    }

    if (values.maxDiscountAmount) {
      const cap = Number(values.maxDiscountAmount)
      if (!Number.isFinite(cap) || cap <= 0) {
        context.addIssue({
          code: "custom",
          path: ["maxDiscountAmount"],
          message: "Maximum discount cap must be greater than zero",
        })
      }
      if (values.type === "FIXED") {
        context.addIssue({
          code: "custom",
          path: ["maxDiscountAmount"],
          message: "Maximum cap is only available for percentage discounts",
        })
      }
    }

    if (values.startsAt && Number.isNaN(Date.parse(values.startsAt))) {
      context.addIssue({
        code: "custom",
        path: ["startsAt"],
        message: "Enter a valid start date",
      })
    }
    if (values.endsAt && Number.isNaN(Date.parse(values.endsAt))) {
      context.addIssue({
        code: "custom",
        path: ["endsAt"],
        message: "Enter a valid end date",
      })
    }
    if (
      values.startsAt &&
      values.endsAt &&
      !Number.isNaN(Date.parse(values.startsAt)) &&
      !Number.isNaN(Date.parse(values.endsAt)) &&
      new Date(values.startsAt) >= new Date(values.endsAt)
    ) {
      context.addIssue({
        code: "custom",
        path: ["endsAt"],
        message: "End date must be after start date",
      })
    }

    if (
      values.usageLimit &&
      (!Number.isInteger(Number(values.usageLimit)) ||
        Number(values.usageLimit) < 1)
    ) {
      context.addIssue({
        code: "custom",
        path: ["usageLimit"],
        message: "Usage limit must be a positive whole number",
      })
    }
  })

export type DiscountFormValues = z.infer<typeof discountFormSchema>
