import { z } from "zod"

export const generalSettingsSchema = z.object({
    companyName: z.string().trim().min(1, "Company name is required").max(100),

    companyEmail: z
        .string()
        .trim()
        .min(1, "Company email is required")
        .email("Enter a valid email address"),

    companyPhone: z.string().trim().min(1, "Company phone is required").max(20),

    companyAddress: z
        .string()
        .trim()
        .min(1, "Company address is required")
        .max(500),

    logo: z.union([z.string().url("Enter a valid logo URL"), z.literal("")]),

    favicon: z.union([
        z.string().url("Enter a valid favicon URL"),
        z.literal(""),
    ]),

    currency: z
        .string()
        .trim()
        .length(3, "Currency must be a 3-letter code")
        .transform((value) => value.toUpperCase()),

    timezone: z.string().trim().min(1, "Timezone is required"),
})

export type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>

export const companyInformationSchema = generalSettingsSchema.pick({
    companyName: true,
    companyEmail: true,
    companyPhone: true,
    companyAddress: true,
})

export const brandingSettingsSchema = generalSettingsSchema.pick({
    logo: true,
    favicon: true,
})

export const regionalPreferencesSchema = generalSettingsSchema.pick({
    currency: true,
    timezone: true,
})
