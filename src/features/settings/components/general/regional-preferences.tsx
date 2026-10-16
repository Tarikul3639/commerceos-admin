import { Controller, type Control } from "react-hook-form"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import type { GeneralSettingsFormValues } from "../../schemas/general-settings.schema"

interface RegionalPreferencesProps {
    control: Control<GeneralSettingsFormValues>
}

export function RegionalPreferences({ control }: RegionalPreferencesProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Regional Preferences</CardTitle>
                <CardDescription>
                    Choose your store's default currency and timezone.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="grid gap-5 sm:grid-cols-2">
                    <Controller
                        control={control}
                        name="currency"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Currency</FieldLabel>

                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                    >
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="BDT">BDT — Bangladeshi Taka</SelectItem>
                                        <SelectItem value="USD">USD — US Dollar</SelectItem>
                                        <SelectItem value="EUR">EUR — Euro</SelectItem>
                                        <SelectItem value="GBP">GBP — British Pound</SelectItem>
                                        <SelectItem value="INR">INR — Indian Rupee</SelectItem>
                                    </SelectContent>
                                </Select>

                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />

                    <Controller
                        control={control}
                        name="timezone"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Timezone</FieldLabel>

                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                    >
                                        <SelectValue placeholder="Select timezone" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="Asia/Dhaka">
                                            Asia/Dhaka (UTC+06:00)
                                        </SelectItem>
                                        <SelectItem value="Asia/Kolkata">
                                            Asia/Kolkata (UTC+05:30)
                                        </SelectItem>
                                        <SelectItem value="UTC">UTC</SelectItem>
                                        <SelectItem value="Europe/London">Europe/London</SelectItem>
                                        <SelectItem value="America/New_York">
                                            America/New_York
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
