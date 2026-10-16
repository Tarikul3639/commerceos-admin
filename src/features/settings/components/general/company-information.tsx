
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
import { Textarea } from "@/components/ui/textarea"

import type { GeneralSettingsFormValues } from "../../schemas/general-settings.schema"

interface CompanyInformationProps {
    control: Control<GeneralSettingsFormValues>
}

export function CompanyInformation({
    control,
}: CompanyInformationProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                    Manage your company name and contact details.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="grid gap-5 sm:grid-cols-2">
                    <Controller
                        control={control}
                        name="companyName"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Company name
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="CommerceOS"
                                    aria-invalid={fieldState.invalid}
                                />
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />

                    <Controller
                        control={control}
                        name="companyEmail"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Company email
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="email"
                                    placeholder="admin@example.com"
                                    aria-invalid={fieldState.invalid}
                                />
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />

                    <Controller
                        control={control}
                        name="companyPhone"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Phone number
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="tel"
                                    placeholder="+8801712345678"
                                    aria-invalid={fieldState.invalid}
                                />
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />

                    <Controller
                        control={control}
                        name="companyAddress"
                        render={({ field, fieldState }) => (
                            <Field
                                className="sm:col-span-2"
                                data-invalid={fieldState.invalid}
                            >
                                <FieldLabel htmlFor={field.name}>
                                    Company address
                                </FieldLabel>
                                <Textarea
                                    {...field}
                                    id={field.name}
                                    rows={3}
                                    placeholder="Dhaka, Bangladesh"
                                    aria-invalid={fieldState.invalid}
                                />
                                <FieldDescription>
                                    Enter your registered company address.
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
