"use client"

import Image from "next/image"
import {
  Controller,
  type Control,
  type FieldArrayWithId,
  type FieldErrors,
  type UseFieldArrayAppend,
  type UseFieldArrayRemove,
} from "react-hook-form"
import { Check, ChevronsUpDown, Package, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import type { ProductListItem } from "@/features/products/types/product.types"
import type { PurchaseFormValues } from "../../schemas/purchase.schema"

interface PurchaseItemsProps {
  control: Control<PurchaseFormValues>
  fields: FieldArrayWithId<PurchaseFormValues, "items", "id">[]
  products: ProductListItem[]
  append: UseFieldArrayAppend<PurchaseFormValues, "items">
  remove: UseFieldArrayRemove
  isLoading: boolean
  errors: FieldErrors<PurchaseFormValues>
}

/** Builds a searchable label from a product and its active variant SKUs. */
function getProductLabel(product: ProductListItem): string {
  const skus = (product.variants ?? [])
    .filter((variant) => variant.isActive)
    .map((variant) => variant.sku)
    .join(", ")

  return skus ? `${product.name} · ${skus}` : product.name
}

/** Renders editable product rows for a supplier purchase. */
export function PurchaseItems({
  control,
  fields,
  products,
  append,
  remove,
  isLoading,
  errors,
}: PurchaseItemsProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-background">
              <Package className="size-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-base">Purchase items</CardTitle>
              <CardDescription>
                Add each product once, then set its quantity and unit cost.
              </CardDescription>
            </div>
          </div>
          <span className="w-fit rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            {fields.length} {fields.length === 1 ? "item" : "items"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-5">
        {fields.map((item, index) => (
          <div key={item.id} className="rounded-xl border bg-card p-3 sm:p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium">Item {index + 1}</p>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-8 text-muted-foreground hover:text-destructive"
                aria-label={`Remove item ${index + 1}`}
                disabled={fields.length === 1 || isLoading}
                onClick={() => remove(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <Controller
                control={control}
                name={`items.${index}.productId`}
                render={({ field, fieldState }) => {
                  const selectedProduct = products.find(
                    (product) => product.id === field.value
                  )

                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        Product <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            disabled={isLoading}
                            aria-invalid={fieldState.invalid}
                            className="h-auto min-h-11 w-full justify-between gap-3 px-3 py-2 font-normal"
                          >
                            {selectedProduct ? (
                              <span className="flex min-w-0 items-center gap-3 text-left">
                                <Image
                                  src={
                                    selectedProduct.image ?? "/placeholder.png"
                                  }
                                  alt=""
                                  width={36}
                                  height={36}
                                  unoptimized
                                  className="size-9 shrink-0 rounded-md border object-cover"
                                />
                                <span className="min-w-0">
                                  <span className="block truncate text-sm font-medium text-foreground">
                                    {selectedProduct.name}
                                  </span>
                                  <span className="block truncate text-xs text-muted-foreground">
                                    {getProductLabel(selectedProduct) ===
                                    selectedProduct.name
                                      ? "Selected product"
                                      : getProductLabel(
                                          selectedProduct
                                        ).replace(
                                          `${selectedProduct.name} · `,
                                          ""
                                        )}
                                  </span>
                                </span>
                              </span>
                            ) : (
                              <span className="text-muted-foreground">
                                Select a product
                              </span>
                            )}
                            <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent
                          align="start"
                          className="w-(--radix-popover-trigger-width) p-0"
                        >
                          <Command>
                            <CommandInput placeholder="Search products or SKUs..." />
                            <CommandList>
                              <CommandEmpty>No product found.</CommandEmpty>
                              <CommandGroup>
                                {products.map((product) => (
                                  <CommandItem
                                    key={product.id}
                                    value={getProductLabel(product)}
                                    onSelect={() => field.onChange(product.id)}
                                  >
                                    <Image
                                      src={product.image ?? "/placeholder.png"}
                                      alt=""
                                      width={36}
                                      height={36}
                                      unoptimized
                                      className="size-9 shrink-0 rounded-md border object-cover"
                                    />
                                    <span className="min-w-0 flex-1">
                                      <span className="block truncate font-medium">
                                        {product.name}
                                      </span>
                                      <span className="block truncate text-xs text-muted-foreground">
                                        {getProductLabel(product) ===
                                        product.name
                                          ? "No active variants"
                                          : getProductLabel(product).replace(
                                              `${product.name} · `,
                                              ""
                                            )}
                                      </span>
                                    </span>
                                    <Check
                                      className={cn(
                                        "ml-auto size-4 shrink-0",
                                        field.value === product.id
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )
                }}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Controller
                  control={control}
                  name={`items.${index}.quantity`}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        Quantity <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        min={1}
                        step={1}
                        disabled={isLoading}
                        onChange={(event) =>
                          field.onChange(event.target.valueAsNumber)
                        }
                        aria-invalid={fieldState.invalid}
                        className="h-10"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name={`items.${index}.unitPrice`}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        Unit cost <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        step="any"
                        min={0}
                        disabled={isLoading}
                        placeholder="0.00"
                        aria-invalid={fieldState.invalid}
                        className="h-10"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>
          </div>
        ))}

        {errors.items?.root && (
          <p className="text-sm text-destructive">
            {errors.items.root.message}
          </p>
        )}
        {errors.items?.message && (
          <p className="text-sm text-destructive">{errors.items.message}</p>
        )}

        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed sm:w-auto"
          onClick={() => append({ productId: "", quantity: 1, unitPrice: "" })}
          disabled={isLoading}
        >
          <Plus className="size-4" />
          Add another item
        </Button>
      </CardContent>
    </Card>
  )
}
