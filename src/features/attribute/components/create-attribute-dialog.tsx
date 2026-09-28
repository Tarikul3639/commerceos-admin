"use client"

import { useState } from "react"
import { Plus, Tag, Loader2, Trash2 } from "lucide-react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import { getErrorMessage } from "@/lib/utils/error"

import {
    createAttributeSchema,
    type CreateAttributeFormValues,
} from "../schemas/create-attribute.schema"
import {
    useCreateAttributeMutation,
    useCreateAttributeValueMutation,
} from "../api/attribute.api"

export function CreateAttributeDialog() {
    const [open, setOpen] = useState(false)

    const [createAttribute, { isLoading: isCreatingAttribute }] =
        useCreateAttributeMutation()

    const [createAttributeValue, { isLoading: isCreatingValues }] =
        useCreateAttributeValueMutation()

    const form = useForm<CreateAttributeFormValues>({
        resolver: zodResolver(createAttributeSchema),
        defaultValues: {
            name: "",
            values: [],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "values",
    })

    const isLoading = isCreatingAttribute || isCreatingValues

    async function onSubmit(values: CreateAttributeFormValues) {
        try {
            const attribute = await createAttribute({
                name: values.name,
            }).unwrap()

            if (values.values.length > 0) {
                await Promise.all(
                    values.values.map(({ value }) =>
                        createAttributeValue({
                            attributeId: attribute.id,
                            data: { value },
                        }).unwrap()
                    )
                )
            }

            toast.success("Attribute created successfully")

            form.reset()
            setOpen(false)
        } catch (error) {
            toast.error(
                getErrorMessage(error) ||
                "Failed to create attribute. Please try again."
            )
        }
    }

    function handleOpenChange(value: boolean) {
        setOpen(value)

        if (!value) {
            form.reset()
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <Plus strokeWidth={3.5} />
                    Attribute
                </Button>
            </DialogTrigger>

            <DialogContent className="w-[calc(100%-2rem)] max-w-md overflow-hidden p-0">
                <DialogHeader className="border-b px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Tag className="size-4" />
                        </div>

                        <div className="min-w-0 space-y-0.5">
                            <DialogTitle className="truncate">Create Attribute</DialogTitle>

                            <DialogDescription className="text-sm">
                                Add an attribute and its initial values.
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
                                        placeholder="e.g. Color, Size, Material"
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
                            Values can be added or managed later.
                        </span>

                        <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOpenChange(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>

                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create"
                                )}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
