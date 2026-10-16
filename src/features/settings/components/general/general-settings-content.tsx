"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { PageContainer } from "@/components/layout/page-container"
import { UnsavedChangesBar } from "@/components/shared/unsaved-changes-bar"

import {
    generalSettingsSchema,
    type GeneralSettingsFormValues,
} from "../../schemas/general-settings.schema"
import {
    useGetGeneralSettingsQuery,
    useUpdateGeneralSettingsMutation,
} from "../../api/general-settings.api"

import { CompanyInformation } from "./company-information"
import { BrandingSettings } from "./branding-settings"
import { RegionalPreferences } from "./regional-preferences"

const defaultValues: GeneralSettingsFormValues = {
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
    logo: "",
    favicon: "",
    currency: "BDT",
    timezone: "Asia/Dhaka",
}

const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Settings", href: "/dashboard/settings" },
    { label: "General" },
]

export function GeneralSettingsContent() {
    const { data, isLoading, isError } = useGetGeneralSettingsQuery()

    const [updateSettings, { isLoading: isSaving }] =
        useUpdateGeneralSettingsMutation()

    const form = useForm<GeneralSettingsFormValues>({
        resolver: zodResolver(generalSettingsSchema),
        defaultValues,
    })

    // Populate the form with the latest server data.
    useEffect(() => {
        if (!data) return

        form.reset({
            companyName: data.companyName,
            companyEmail: data.companyEmail,
            companyPhone: data.companyPhone,
            companyAddress: data.companyAddress,
            logo: data.logo ?? "",
            favicon: data.favicon ?? "",
            currency: data.currency,
            timezone: data.timezone,
        })
    }, [data, form.reset])

    const onSubmit = async (values: GeneralSettingsFormValues) => {
        try {
            const saved = await updateSettings({
                ...values,
                logo: values.logo || null,
                favicon: values.favicon || null,
            }).unwrap()

            // Reset with the saved server values so the form becomes clean.
            form.reset({
                companyName: saved.companyName,
                companyEmail: saved.companyEmail,
                companyPhone: saved.companyPhone,
                companyAddress: saved.companyAddress,
                logo: saved.logo ?? "",
                favicon: saved.favicon ?? "",
                currency: saved.currency,
                timezone: saved.timezone,
            })

            toast.success("General settings saved successfully.")
        } catch {
            toast.error("Failed to save general settings. Please try again.")
        }
    }

    const handleDiscard = () => {
        if (!data) return

        form.reset({
            companyName: data.companyName,
            companyEmail: data.companyEmail,
            companyPhone: data.companyPhone,
            companyAddress: data.companyAddress,
            logo: data.logo ?? "",
            favicon: data.favicon ?? "",
            currency: data.currency,
            timezone: data.timezone,
        })
    }

    if (isLoading) {
        return (
            <PageContainer title="General Settings" breadcrumbs={breadcrumbs}>
                <p className="text-sm text-muted-foreground">
                    Loading general settings...
                </p>
            </PageContainer>
        )
    }

    if (isError || !data) {
        return (
            <PageContainer title="General Settings" breadcrumbs={breadcrumbs}>
                <p className="text-sm text-destructive">
                    Failed to load general settings. Please refresh the page and try
                    again.
                </p>
            </PageContainer>
        )
    }

    return (
        <PageContainer title="General Settings" breadcrumbs={breadcrumbs}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-8">
                <div className="space-y-6">
                    <CompanyInformation control={form.control} />
                    <BrandingSettings control={form.control} />
                    <RegionalPreferences control={form.control} />
                </div>

                <UnsavedChangesBar
                    open={form.formState.isDirty}
                    isSaving={isSaving}
                    // position="bottom"
                    message="You have unsaved changes. Save them before leaving."
                    onSave={form.handleSubmit(onSubmit)}
                    onDiscard={handleDiscard}
                />
            </form>
        </PageContainer>
    )
}
