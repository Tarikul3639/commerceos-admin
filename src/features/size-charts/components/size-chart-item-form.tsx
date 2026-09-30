"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

import {
    sizeChartItemSchema,
    type SizeChartItemFormValues,
} from "../schemas/size-chart.schema"
import type { SizeChartItem } from "../types/size-chart.types"

const measurements = [
    "chest",
    "length",
    "shoulder",
    "sleeve",
    "waist",
    "hip",
    "inseam",
] as const

const measurementLabels: Record<(typeof measurements)[number], string> = {
    chest: "Chest",
    length: "Length",
    shoulder: "Shoulder",
    sleeve: "Sleeve",
    waist: "Waist",
    hip: "Hip",
    inseam: "Inseam",
}

export function SizeChartItemForm({
    item,
    onSubmit,
    onCancel,
    isLoading = false,
}: {
    item?: SizeChartItem
    onSubmit: (values: SizeChartItemFormValues) => void | Promise<void>
    onCancel: () => void
    isLoading?: boolean
}) {
    const { control, handleSubmit } = useForm<SizeChartItemFormValues>({
        resolver: zodResolver(sizeChartItemSchema),
        defaultValues: {
            size: item?.size ?? "",
            chest: item?.chest ? Number(item.chest) : "",
            length: item?.length ? Number(item.length) : "",
            shoulder: item?.shoulder ? Number(item.shoulder) : "",
            sleeve: item?.sleeve ? Number(item.sleeve) : "",
            waist: item?.waist ? Number(item.waist) : "",
            hip: item?.hip ? Number(item.hip) : "",
            inseam: item?.inseam ? Number(item.inseam) : "",
        },
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="gap-5">
                <Controller
                    name="size"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Size</FieldLabel>

                            <Input
                                {...field}
                                placeholder="e.g. M, L, XL, 32"
                                disabled={isLoading}
                            />

                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <div className="space-y-3">
                    <div>
                        <h3 className="text-sm font-medium">Measurements</h3>
                        <p className="text-xs text-muted-foreground">
                            Enter measurements in your standard unit.
                        </p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                        {measurements.map((measurement) => (
                            <Controller
                                key={measurement}
                                name={measurement}
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>{measurementLabels[measurement]}</FieldLabel>

                                        <Input
                                            {...field}
                                            value={field.value ?? ""}
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="—"
                                            onChange={(event) =>
                                                field.onChange(
                                                    event.target.value === ""
                                                        ? ""
                                                        : Number(event.target.value)
                                                )
                                            }
                                            disabled={isLoading}
                                        />

                                        {fieldState.error && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        ))}
                    </div>
                </div>
            </FieldGroup>

            <Separator className="my-6" />

            <div className="flex justify-end gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : item ? "Update Size" : "Add Size"}
                </Button>
            </div>
        </form>
    )
}
