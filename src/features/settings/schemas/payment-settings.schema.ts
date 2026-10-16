import { z } from "zod"

export const paymentMethodConfigSchema = z.object({
    displayName: z.string().trim().min(1, "Display name is required"),
    isEnabled: z.boolean(),
    accountName: z.string(),
    accountNumber: z.string(),
    bankName: z.string(),
    branchName: z.string(),
    routingNumber: z.string(),
    instructions: z.string(),
})

export type PaymentMethodConfigFormValues = z.infer<
    typeof paymentMethodConfigSchema
>
