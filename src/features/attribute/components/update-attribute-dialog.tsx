"use client"

import { useEffect } from "react"
import { Tag, Loader2, Plus, Trash2 } from "lucide-react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import {
    updateAttributeSchema,
    type UpdateAttributeFormValues,
} from "../schemas/update-attribute.schema"
import {
    useUpdateAttributeMutation,
    useCreateAttributeValueMutation,
    useUpdateAttributeValueMutation,
    useDeleteAttributeValueMutation,
} from "../api/attribute.api"
import type { Attribute } from "../types/attribute.types"

interface UpdateAttributeDialogProps {
    attribute: Attribute
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function UpdateAttributeDialog({
    attribute,
    open,
    onOpenChange,
}: UpdateAttributeDialogProps) {
    const [updateAttribute, { isLoading: isUpdatingAttribute }] =
        useUpdateAttributeMutation()

    const [createAttributeValue, { isLoading: isCreatingValue }] =
        useCreateAttributeValueMutation()

    const [updateAttributeValue, { isLoading: isUpdatingValue }] =
        useUpdateAttributeValueMutation()

    const [deleteAttributeValue, { isLoading: isDeletingValue }] =
        useDeleteAttributeValueMutation()

    const form = useForm<UpdateAttributeFormValues>({
        resolver: zodResolver(updateAttributeSchema),
        defaultValues: {
            name: attribute.name,
            values: attribute.values.map((item) => ({
                id: item.id,
                value: item.value,
            })),
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "values",
    })

    const isLoading =
        isUpdatingAttribute || isCreatingValue || isUpdatingValue || isDeletingValue

    useEffect(() => {
        if (open) {
            form.reset({
                name: attribute.name,
                values: attribute.values.map((item) => ({
                    id: item.id,
                    value: item.value,
                })),
            })
        }
    }, [open, attribute, form])

    async function onSubmit(values: UpdateAttributeFormValues) {
        try {
            await updateAttribute({
                id: attribute.id,
                data: {
                    name: values.name,
                },
            }).unwrap()

            const existingValueIds = new Set(
                values.values.map((item) => item.id).filter(Boolean)
            )

            const removedValues = attribute.values.filter(
                (item) => !existingValueIds.has(item.id)
            )

            await Promise.all([
                ...values.values.map((item) => {
                    if (item.id) {
                        return updateAttributeValue({
                            valueId: item.id,
                            data: {
                                value: item.value,
                            },
                        }).unwrap()
                    }

                    return createAttributeValue({
                        attributeId: attribute.id,
                        data: {
                            value: item.value,
                        },
                    }).unwrap()
                }),

                ...removedValues.map((item) => deleteAttributeValue(item.id).unwrap()),
            ])

            onOpenChange(false)
        } catch {
            // handled by global API error handler
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100%-2rem)] max-w-md overflow-hidden p-0">
                <DialogHeader className="border-b px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Tag className="size-4" />
                        </div>

                        <div className="min-w-0 space-y-0.5">
                            <DialogTitle>Update Attribute</DialogTitle>

                            <DialogDescription>
                                Update the attribute and its values.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex max-h-[calc(90vh-73px)] flex-col"
                >
                    <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6">
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Attribute Name</FieldLabel>

                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="e.g. Color"
                                        disabled={isLoading}
                                        aria-invalid={fieldState.invalid}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <div className="space-y-2.5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <FieldLabel>Values</FieldLabel>

                                    <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                                        {fields.length}
                                    </Badge>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append({ value: "" })}
                                    disabled={isLoading}
                                >
                                    <Plus className="mr-1.5 size-3.5" />
                                    Add Value
                                </Button>
                            </div>

                            {fields.length > 0 ? (
                                <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="flex items-start gap-2">
                                            <Controller
                                                name={`values.${index}.value`}
                                                control={form.control}
                                                render={({ field, fieldState }) => (
                                                    <Field
                                                        className="min-w-0 flex-1"
                                                        data-invalid={fieldState.invalid}
                                                    >
                                                        <Input
                                                            {...field}
                                                            placeholder="e.g. Red, XL, Cotton"
                                                            disabled={isLoading}
                                                            aria-invalid={fieldState.invalid}
                                                        />

                                                        {fieldState.invalid && (
                                                            <FieldError errors={[fieldState.error]} />
                                                        )}
                                                    </Field>
                                                )}
                                            />

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => remove(index)}
                                                disabled={isLoading}
                                                className="shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                aria-label="Remove value"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-md border border-dashed px-3 py-3 text-center">
                                    <p className="text-xs text-muted-foreground">
                                        No values added yet. Click{" "}
                                        <span className="font-medium">Add Value</span> to add one.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="flex-row items-center justify-end border-t px-4 py-3 sm:justify-between sm:px-6">
                        <span className="hidden text-xs text-muted-foreground sm:flex">
                            Existing values can be updated or removed.
                        </span>

                        <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>

                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    "Update"
                                )}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
