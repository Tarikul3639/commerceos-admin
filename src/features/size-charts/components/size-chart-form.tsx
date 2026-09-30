"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import {
    sizeChartSchema,
    type SizeChartFormValues,
} from "../schemas/size-chart.schema"
import type { SizeChart } from "../types/size-chart.types"

export function SizeChartForm({
    sizeChart,
    onSubmit,
    onCancel,
    submitLabel = "Save",
    isLoading = false,
}: {
    sizeChart?: SizeChart
    onSubmit: (values: SizeChartFormValues) => void | Promise<void>
    onCancel: () => void
    submitLabel?: string
    isLoading?: boolean
}) {
    const { control, handleSubmit } = useForm<SizeChartFormValues>({
        resolver: zodResolver(sizeChartSchema),
        defaultValues: { name: sizeChart?.name ?? "" },
    })

    return (
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Name</FieldLabel>
                        <Input {...field} placeholder="Men's clothing" disabled={isLoading} />
                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : submitLabel}
                </Button>
            </div>
        </form>
    )
}
