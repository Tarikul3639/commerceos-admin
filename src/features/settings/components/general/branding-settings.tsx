
import { Controller, type Control } from "react-hook-form"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import type { GeneralSettingsFormValues } from "../../schemas/general-settings.schema"

interface BrandingSettingsProps {
    control: Control<GeneralSettingsFormValues>
}

export function BrandingSettings({ control }: BrandingSettingsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Branding</CardTitle>
                <CardDescription>
                    Configure your store logo and favicon to maintain consistent branding.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="grid gap-5 sm:grid-cols-2">
                    <Controller
                        control={control}
                        name="logo"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Logo URL</FieldLabel>

                                <Input
                                    {...field}
                                    id={field.name}
                                    type="url"
                                    placeholder="https://cdn.example.com/logo.png"
                                    aria-invalid={fieldState.invalid}
                                />

                                <FieldDescription>
                                    Enter the URL of your store logo.
                                </FieldDescription>

                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />

                    <Controller
                        control={control}
                        name="favicon"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Favicon URL</FieldLabel>

                                <Input
                                    {...field}
                                    id={field.name}
                                    type="url"
                                    placeholder="https://cdn.example.com/favicon.ico"
                                    aria-invalid={fieldState.invalid}
                                />

                                <FieldDescription>
                                    Enter the URL of your store favicon.
                                </FieldDescription>

                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
