"use client"

import { useCallback, useEffect, useMemo } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, Loader2, RefreshCw } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  useCreateProductVariantMutation,
  useUpdateProductVariantMutation,
} from "../../api/product-variant-api"
import type { ProductOption } from "../../types/product-option.types"
import { getErrorMessage } from "@/lib/utils/error"
import type {
  ProductVariant,
  VariantOptions,
} from "../../types/product-variant.types"
import { productVariantSchema } from "../../schemas/product-variant.schema"
import type { ProductVariantFormValues } from "../../schemas/product-variant.schema"
import {
  generateInternalBarcode,
  generateSku,
} from "../../utils/variant-identifiers"

type Props = {
  productId: string
  productName: string
  variant: ProductVariant | null
  variants: ProductVariant[]
  productOptions: ProductOption[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VariantEditDialog({
  productId,
  productName,
  variant,
  variants,
  productOptions,
  open,
  onOpenChange,
}: Props) {
  const [createVariant, { isLoading: isCreating }] =
    useCreateProductVariantMutation()
  const [updateVariant, { isLoading: isUpdating }] =
    useUpdateProductVariantMutation()

  const schema = useMemo(
    () =>
      productVariantSchema.superRefine((values, context) => {
        for (const option of productOptions) {
          if (!values.options[option.id]) {
            context.addIssue({
              code: "custom",
              path: ["options", option.id],
              message: `Choose a value for ${option.name}`,
            })
          }
        }
      }),
    [productOptions]
  )

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductVariantFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      sku: "",
      barcode: "",
      options: {},
      isActive: true,
    },
  })

  const selectedOptions = useWatch({ control, name: "options" })
  const busy = isCreating || isUpdating || isSubmitting

  const createIdentifierPreview = useCallback(
    (selection: VariantOptions) => {
      const labels = productOptions.flatMap((option) => {
        const selected = option.values.find(
          (value) => value.id === selection[option.id]
        )
        return selected ? [selected.label] : []
      })

      return {
        sku: generateSku(productName, labels),
        barcode: generateInternalBarcode(),
      }
    },
    [productName, productOptions]
  )

  useEffect(() => {
    if (!open) return

    reset(
      variant
        ? {
            sku: variant.sku,
            barcode: variant.barcode ?? "",
            options: { ...variant.options },
            isActive: variant.isActive,
          }
        : {
            ...createIdentifierPreview({}),
            options: {},
            isActive: true,
          }
    )
  }, [
    open,
    variant,
    productOptions,
    productName,
    reset,
    createIdentifierPreview,
  ])

  const handleSave = async (values: ProductVariantFormValues) => {
    const sku = values.sku.trim()
    const barcode = values.barcode.trim()
    const duplicateSku = variants.some(
      (item) =>
        item.id !== variant?.id &&
        item.sku.trim().toLowerCase() === sku.toLowerCase()
    )
    const duplicateBarcode = variants.some(
      (item) =>
        item.id !== variant?.id &&
        !!item.barcode &&
        item.barcode.trim().toLowerCase() === barcode.toLowerCase()
    )

    if (duplicateSku) {
      toast.error("This SKU is already used by another variant")
      return
    }
    if (duplicateBarcode) {
      toast.error("This barcode is already used by another variant")
      return
    }

    try {
      if (variant) {
        await updateVariant({
          productId,
          variantId: variant.id,
          data: {
            sku,
            barcode,
            options: values.options,
            isActive: values.isActive,
          },
        }).unwrap()
        toast.success("Variant updated")
      } else {
        await createVariant({
          productId,
          sku,
          barcode,
          options: values.options,
        }).unwrap()
        toast.success("Variant created")
      }
      onOpenChange(false)
    } catch (error) {
      toast.error(
        variant ? "Unable to update variant" : "Unable to create variant",
        { description: getErrorMessage(error) }
      )
    }
  }

  const handleOptionChange = (
    optionId: string,
    valueId: string,
    onChange: (value: string) => void
  ) => {
    onChange(valueId)
    const nextOptions = { ...selectedOptions }
    if (valueId) nextOptions[optionId] = valueId
    else delete nextOptions[optionId]

    if (!variant) {
      const identifiers = createIdentifierPreview(nextOptions)
      setValue("sku", identifiers.sku, { shouldDirty: true })
      setValue("barcode", identifiers.barcode, { shouldDirty: true })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {variant ? "Update product variant" : "Create product variant"}
          </DialogTitle>
          <DialogDescription>
            {variant
              ? "Update option values, SKU and barcode for this variant."
              : "Choose option values. SKU and barcode are generated automatically and can be edited."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleSave)} className="space-y-5">
          {productOptions.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {productOptions.map((option) => (
                <div key={option.id} className="space-y-2">
                  <Label htmlFor={`variant-option-${option.id}`}>
                    {option.name}
                  </Label>
                  <Controller
                    control={control}
                    name={`options.${option.id}`}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={(value) =>
                          handleOptionChange(option.id, value, field.onChange)
                        }
                        disabled={busy}
                      >
                        <SelectTrigger
                          id={`variant-option-${option.id}`}
                          className="w-full"
                        >
                          <SelectValue
                            placeholder={`Choose ${option.name.toLowerCase()}`}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {option.values.map((value) => (
                            <SelectItem key={value.id} value={value.id}>
                              {value.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.options?.[option.id]?.message && (
                    <p className="text-sm text-destructive">
                      {errors.options[option.id]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
              Standard product variant — no options configured.
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="variant-sku">SKU</Label>
              <Input
                id="variant-sku"
                {...register("sku")}
                disabled={busy}
                className="font-mono"
              />
              {errors.sku?.message && (
                <p className="text-sm text-destructive">{errors.sku.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="variant-barcode">Barcode</Label>
              <Input
                id="variant-barcode"
                {...register("barcode")}
                disabled={busy}
                className="font-mono"
              />
              {errors.barcode?.message && (
                <p className="text-sm text-destructive">
                  {errors.barcode.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="px-0"
            disabled={busy}
            onClick={() => {
              const identifiers = createIdentifierPreview(selectedOptions ?? {})
              setValue("sku", identifiers.sku, { shouldDirty: true })
              setValue("barcode", identifiers.barcode, { shouldDirty: true })
            }}
          >
            <RefreshCw className="size-3.5" />
            Regenerate SKU and barcode
          </Button>

          {variant && (
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="variant-is-active">Active variant</Label>
                <p className="text-sm text-muted-foreground">
                  Inactive variants cannot be purchased.
                </p>
              </div>
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <Switch
                    id="variant-is-active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={busy}
                  />
                )}
              />
            </div>
          )}

          <DialogFooter className="border-t pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              {busy
                ? variant
                  ? "Updating..."
                  : "Creating..."
                : variant
                  ? "Update variant"
                  : "Create variant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
