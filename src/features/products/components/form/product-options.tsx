"use client"

import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { Loader2, Plus, Save, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    useCreateProductOptionMutation,
    useDeleteProductOptionMutation,
    useGetProductOptionsQuery,
    useUpdateProductOptionMutation,
} from "../../api/product-option-api"
import type {
    CreateProductOptionValueRequest,
    ProductOptionType,
} from "../../types/product-option.types"
import {
    productOptionSchema,
    type ProductOptionFormValues,
} from "../../schemas/product-option.schema"
import { getErrorMessage } from "@/lib/utils/error"

interface ProductOptionsProps {
    productId: string
    disabled?: boolean
}

interface OptionValueDraft {
    id: string
    value: string
    colorHex: string
}

interface OptionDraft {
    id: string
    optionId?: string
    name: string
    type: ProductOptionType
    values: OptionValueDraft[]
}

type OptionErrors = Partial<Record<keyof ProductOptionFormValues, string>>

const OPTION_TYPES: Record<
    ProductOptionType,
    { label: string; placeholder: string }
> = {
    COLOR: { label: "Color", placeholder: "e.g. Black" },
    SIZE: { label: "Size", placeholder: "e.g. XL" },
    MATERIAL: { label: "Material", placeholder: "e.g. Cotton" },
    STYLE: { label: "Style", placeholder: "e.g. Casual" },
    CUSTOM: { label: "Custom", placeholder: "Enter value" },
}

const createEmptyValue = (): OptionValueDraft => ({
    id: uuidv4(),
    value: "",
    colorHex: "#000000",
})

const createEmptyOption = (): OptionDraft => ({
    id: uuidv4(),
    name: "",
    type: "COLOR",
    values: [createEmptyValue()],
})

interface ValueAdderProps {
    type: ProductOptionType
    existing: string[]
    disabled?: boolean
    onAdd: (value: string, colorHex?: string) => void
}

function ValueAdder({ type, existing, disabled, onAdd }: ValueAdderProps) {
    const [text, setText] = useState("")
    const [colorHex, setColorHex] = useState("#000000")

    const submit = () => {
        const value = text.trim()

        if (!value) {
            toast.error(
                type === "COLOR" ? "Enter a color name first" : "Enter a value first"
            )
            return
        }

        const duplicate = existing.some(
            (item) => item.trim().toLowerCase() === value.toLowerCase()
        )

        if (duplicate) {
            toast.error("This value already exists")
            return
        }

        onAdd(value, type === "COLOR" ? colorHex : undefined)
        setText("")
    }

    return (
        <div className="flex items-center gap-2">
            {type === "COLOR" && (
                <input
                    type="color"
                    aria-label="Pick a color"
                    value={colorHex}
                    onChange={(event) => setColorHex(event.target.value)}
                    disabled={disabled}
                    className="size-9 shrink-0 cursor-pointer rounded-md border bg-background p-1"
                />
            )}

            <div className="relative flex-1">
                <Input
                    className="pr-16"
                    placeholder={
                        type === "COLOR"
                            ? "e.g. Black, Red, Navy Blue"
                            : OPTION_TYPES[type].placeholder
                    }
                    value={text}
                    disabled={disabled}
                    onChange={(event) => setText(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key !== "Enter") return
                        event.preventDefault()
                        event.stopPropagation()
                        submit()
                    }}
                />

                <span className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 text-xs text-muted-foreground sm:block">
                    Enter ↵
                </span>
            </div>

            <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-9 shrink-0"
                disabled={disabled}
                onClick={submit}
                aria-label="Add value"
            >
                <Plus className="size-4" />
            </Button>
        </div>
    )
}

export function ProductOptions({
    productId,
    disabled = false,
}: ProductOptionsProps) {
    const [forms, setForms] = useState<OptionDraft[]>([createEmptyOption()])
    const [errors, setErrors] = useState<Record<string, OptionErrors>>({})

    const { data: options = [], isLoading } = useGetProductOptionsQuery(
        productId,
        {
            skip: !productId,
        }
    )

    const [createProductOption, { isLoading: isCreating }] =
        useCreateProductOptionMutation()
    const [updateProductOption, { isLoading: isUpdating }] =
        useUpdateProductOptionMutation()
    const [deleteProductOption, { isLoading: isDeleting }] =
        useDeleteProductOptionMutation()

    const isBusy = disabled || isCreating || isUpdating || isDeleting

    useEffect(() => {
        setForms((current) => {
            const savedForms: OptionDraft[] = options.map((option) => ({
                id: option.id,
                optionId: option.id,
                name: option.name,
                type: option.type,
                values: option.values.map((item) => ({
                    id: item.id,
                    value: item.value,
                    colorHex: item.colorHex ?? "#000000",
                })),
            }))

            const unsavedForms = current.filter((form) => !form.optionId)

            return [...savedForms, ...unsavedForms]
        })
    }, [options])

    const updateForm = (
        formId: string,
        updater: (form: OptionDraft) => OptionDraft
    ) => {
        setErrors((current) => {
            const next = { ...current }
            delete next[formId]
            return next
        })

        setForms((current) =>
            current.map((form) => (form.id === formId ? updater(form) : form))
        )
    }

    const addOption = () => {
        setForms((current) => [...current, createEmptyOption()])
    }

    const removeForm = (formId: string) => {
        setForms((current) => {
            const remaining = current.filter((form) => form.id !== formId)
            return remaining.length > 0 ? remaining : [createEmptyOption()]
        })
    }

    const addValue = (formId: string, value = "", colorHex = "#000000") => {
        updateForm(formId, (form) => ({
            ...form,
            values: [
                ...form.values,
                {
                    ...createEmptyValue(),
                    value,
                    colorHex,
                },
            ],
        }))
    }

    const removeValue = (formId: string, valueId: string) => {
        updateForm(formId, (form) => ({
            ...form,
            values: form.values.filter((value) => value.id !== valueId),
        }))
    }

    const handleSave = async (
        event: React.FormEvent<HTMLFormElement>,
        form: OptionDraft
    ) => {
        event.preventDefault()

        const parsed = productOptionSchema.safeParse({
            name: form.name,
            type: form.type,
            values: form.values
                .filter((item) => item.value.trim().length > 0)
                .map((item) => ({
                    value: item.value,
                    colorHex: item.colorHex,
                })),
        })

        if (!parsed.success) {
            const formErrors: OptionErrors = {}
            for (const issue of parsed.error.issues) {
                const field = issue.path[0]
                if ((field === "name" || field === "values") && !formErrors[field]) {
                    formErrors[field] = issue.message
                }
            }
            setErrors((current) => ({ ...current, [form.id]: formErrors }))
            return
        }

        setErrors((current) => {
            const next = { ...current }
            delete next[form.id]
            return next
        })

        const { name, values } = parsed.data
        const requestValues: CreateProductOptionValueRequest[] = values.map(
            (item) => ({
                value: item.value,
                ...(form.type === "COLOR" ? { colorHex: item.colorHex } : {}),
            })
        )

        try {
            if (form.optionId) {
                await updateProductOption({
                    productId,
                    optionId: form.optionId,
                    data: {
                        name,
                        type: form.type,
                    },
                }).unwrap()

                toast.success(`${name} option updated`)
            } else {
                await createProductOption({
                    productId,
                    name,
                    type: form.type,
                    values: requestValues,
                }).unwrap()
                // Remove form from state after successful creation
                setForms((current) => {
                    const remaining = current.filter((item) => item.id !== form.id)
                    return remaining.length > 0 ? remaining : [createEmptyOption()]
                })
                toast.success(`${name} option created`)
            }
        } catch (error) {
            toast.error("Failed to save option", {
                description: getErrorMessage(error),
            })
        }
    }

    const handleDelete = async (form: OptionDraft) => {
        if (!form.optionId) {
            removeForm(form.id)
            return
        }

        try {
            await deleteProductOption({
                productId,
                optionId: form.optionId,
            }).unwrap()

            setForms((current) => {
                const remaining = current.filter((item) => item.id !== form.id)
                return remaining.length > 0 ? remaining : [createEmptyOption()]
            })

            toast.success("Option deleted")
        } catch (error) {
            toast.error("Failed to delete option", {
                description: getErrorMessage(error),
            })
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center py-6">
                <Loader2 className="size-4 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {forms.map((form) => {
                const filledValues = form.values.filter((item) => item.value.trim())

                return (
                    <form
                        key={form.id}
                        onSubmit={(event) => handleSave(event, form)}
                        className="w-full"
                    >
                        <Card size="sm">
                            <CardHeader className="border-b py-3">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <CardTitle className="text-sm">
                                            {form.name.trim() || "New option"}
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            {form.optionId
                                                ? "Saved option"
                                                : "Add values before saving"}
                                        </CardDescription>
                                    </div>
                                    <span className="shrink-0 rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                                        {form.optionId ? "Saved" : "Not saved"}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="gap-4 py-4">
                                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_140px]">
                                    <Field data-invalid={!!errors[form.id]?.name}>
                                        <FieldLabel htmlFor={`name-${form.id}`}>
                                            Option name
                                        </FieldLabel>
                                        <Input
                                            id={`name-${form.id}`}
                                            placeholder="e.g. Color"
                                            value={form.name}
                                            onChange={(event) =>
                                                updateForm(form.id, (item) => ({
                                                    ...item,
                                                    name: event.target.value,
                                                }))
                                            }
                                            disabled={isBusy}
                                        />
                                        {errors[form.id]?.name && (
                                            <FieldError
                                                errors={[{ message: errors[form.id]?.name }]}
                                            />
                                        )}
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor={`type-${form.id}`}>Type</FieldLabel>
                                        <Select
                                            value={form.type}
                                            onValueChange={(value) =>
                                                updateForm(form.id, (item) => ({
                                                    ...item,
                                                    type: value as ProductOptionType,
                                                }))
                                            }
                                            disabled={isBusy}
                                        >
                                            <SelectTrigger id={`type-${form.id}`} className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(OPTION_TYPES).map(([key, option]) => (
                                                    <SelectItem key={key} value={key}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                </div>

                                <Field data-invalid={!!errors[form.id]?.values}>
                                    <div className="flex items-center justify-between gap-2">
                                        <div>
                                            <FieldLabel>Values</FieldLabel>
                                            <FieldDescription>
                                                {filledValues.length} added
                                            </FieldDescription>
                                        </div>
                                    </div>
                                    <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-md border border-dashed p-2.5">
                                        {filledValues.length === 0 && (
                                            <span className="px-1 text-sm text-muted-foreground">
                                                No values yet. Add one below.
                                            </span>
                                        )}

                                        {filledValues.map((item) => (
                                            <span
                                                key={item.id}
                                                className={`inline-flex h-7 items-center gap-1.5 rounded-md border bg-background pl-2 text-sm ${form.optionId ? "pr-2" : "pr-1"
                                                    }`}
                                            >
                                                {form.type === "COLOR" && (
                                                    <span
                                                        className="size-3.5 rounded-full border"
                                                        style={{
                                                            backgroundColor: item.colorHex,
                                                        }}
                                                    />
                                                )}

                                                {item.value}

                                                {!form.optionId && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeValue(form.id, item.id)}
                                                        disabled={isBusy}
                                                        className="rounded-sm p-0.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                                                        aria-label={`Remove ${item.value}`}
                                                    >
                                                        <X className="size-3" />
                                                    </button>
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                    {errors[form.id]?.values && (
                                        <FieldError
                                            errors={[{ message: errors[form.id]?.values }]}
                                        />
                                    )}
                                    {form.optionId ? (
                                        <FieldDescription>
                                            Values can't be edited after saving. Delete this option to
                                            create it again with different values.
                                        </FieldDescription>
                                    ) : (
                                        <ValueAdder
                                            type={form.type}
                                            existing={form.values.map((item) => item.value)}
                                            disabled={isBusy}
                                            onAdd={(value, colorHex) =>
                                                addValue(form.id, value, colorHex)
                                            }
                                        />
                                    )}
                                </Field>
                            </CardContent>
                            <CardFooter className="justify-end gap-2 border-t py-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 gap-1.5"
                                    disabled={isBusy}
                                    onClick={() => handleDelete(form)}
                                    aria-label="Delete option"
                                >
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </Button>

                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={
                                        isBusy ||
                                        !productId ||
                                        !form.name.trim() ||
                                        form.values.filter((item) => item.value.trim()).length === 0
                                    }
                                    className="h-8 gap-1.5"
                                >
                                    {isBusy ? (
                                        <>
                                            <Loader2 className="animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save />
                                            Save
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                )
            })}

            <div className="flex justify-center">
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addOption}
                    disabled={isBusy}
                >
                    <Plus />
                    Add Option
                </Button>
            </div>
        </div>
    )
}
