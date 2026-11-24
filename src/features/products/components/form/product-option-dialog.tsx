"use client"

import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { productOptionSchema } from "../../schemas/product-option.schema"
import type {
  ProductOption,
  ProductOptionType,
} from "../../types/product-option.types"
import type { ProductOptionFormValues } from "../../schemas/product-option.schema"
import { OptionValuesEditor } from "./option-values-editor"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  option: ProductOption | null
  isSaving: boolean
  onSave: (values: ProductOptionFormValues) => Promise<void>
}

const OPTION_TYPES: { value: ProductOptionType; label: string }[] = [
  { value: "COLOR", label: "Color" },
  { value: "SIZE", label: "Size" },
  { value: "STORAGE", label: "Storage" },
  { value: "CAPACITY", label: "Capacity" },
  { value: "CUSTOM", label: "Custom" },
]

const getOptionTypeLabel = (type: ProductOptionType) =>
  OPTION_TYPES.find((item) => item.value === type)?.label ?? ""

export function ProductOptionDialog({
  open,
  onOpenChange,
  option,
  isSaving,
  onSave,
}: Props) {
  const {
    register,
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductOptionFormValues>({
    resolver: zodResolver(productOptionSchema),
    defaultValues: {
      name: "",
      type: "CUSTOM",
      values: [],
    },
  })

  const type = useWatch({ control, name: "type" })
  const name = useWatch({ control, name: "name" })
  const values = useWatch({ control, name: "values" }) ?? []

  useEffect(() => {
    if (!open) return
    reset(
      option
        ? {
            name: option.name,
            type: option.type,
            values: option.values,
          }
        : {
            name: getOptionTypeLabel("CUSTOM"),
            type: "CUSTOM",
            values: [],
          }
    )
  }, [open, option, reset])

  const handleTypeChange = (nextType: ProductOptionType) => {
    setValue("type", nextType, { shouldDirty: true })
    if (!name.trim() || name === getOptionTypeLabel(type)) {
      setValue("name", getOptionTypeLabel(nextType), { shouldDirty: true })
    }
    if (nextType !== "COLOR") {
      setValue(
        "values",
        values.map(({ id, label }) => ({ id, label })),
        { shouldDirty: true }
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {option ? "Update product option" : "Create product option"}
          </DialogTitle>
          <DialogDescription>
            Configure the option type, name and values customers can select.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSave)} className="space-y-5">
          <Field>
            <FieldLabel>Option type</FieldLabel>
            <Select
              value={type}
              onValueChange={handleTypeChange}
              disabled={isSaving}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose option type" />
              </SelectTrigger>
              <SelectContent>
                {OPTION_TYPES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>
              The type controls how this option is displayed in the storefront,
              including size guide behavior.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="product-option-name">Option name</FieldLabel>
            <Input
              id="product-option-name"
              {...register("name")}
              placeholder="e.g. Color, Clothing Size, Storage"
              disabled={isSaving}
              maxLength={50}
            />
            {errors.name?.message && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </Field>

          <OptionValuesEditor
            values={values}
            colorOption={type === "COLOR"}
            disabled={isSaving}
            onChange={(nextValues) =>
              setValue("values", nextValues, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            error={
              typeof errors.values?.message === "string"
                ? errors.values.message
                : undefined
            }
          />

          <DialogFooter className="border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              {option ? "Save changes" : "Create option"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
