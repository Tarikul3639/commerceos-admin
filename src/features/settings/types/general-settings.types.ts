
export interface GeneralSettings {
    id: string
    companyName: string
    companyEmail: string
    companyPhone: string
    companyAddress: string
    logo: string | null
    favicon: string | null
    currency: string
    timezone: string
    createdAt: string
    updatedAt: string
}

export interface UpdateGeneralSettingsRequest {
    companyName?: string
    companyEmail?: string
    companyPhone?: string
    companyAddress?: string
    logo?: string | null
    favicon?: string | null
    currency?: string
    timezone?: string
}
