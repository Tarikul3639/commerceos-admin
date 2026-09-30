import { z } from "zod"

export const sizeChartSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
})

export const sizeChartItemSchema = z.object({
    size: z.string().min(1, "Size is required").max(50),
    chest: z.number().min(0).optional().or(z.literal("")),
    length: z.number().min(0).optional().or(z.literal("")),
    shoulder: z.number().min(0).optional().or(z.literal("")),
    sleeve: z.number().min(0).optional().or(z.literal("")),
    waist: z.number().min(0).optional().or(z.literal("")),
    hip: z.number().min(0).optional().or(z.literal("")),
    inseam: z.number().min(0).optional().or(z.literal("")),
})

export type SizeChartFormValues = z.infer<typeof sizeChartSchema>
export type SizeChartItemFormValues = z.infer<typeof sizeChartItemSchema>
