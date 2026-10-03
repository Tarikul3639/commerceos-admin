"use client"

import {
  Controller,
  type Control,
  type FieldArrayWithId,
  type FieldErrors,
  type UseFieldArrayAppend,
  type UseFieldArrayRemove,
} from "react-hook-form"
import { Check, ChevronsUpDown, Plus, Trash2 } from "lucide-react"

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

import type { PurchaseFormValues } from "../../schemas/purchase.schema"

interface Product {
  id: string
  name: string
  sku: string
}

interface PurchaseItemsProps {
  control: Control<PurchaseFormValues>
  fields: FieldArrayWithId<PurchaseFormValues, "items", "id">[]
  products: Product[]
  append: UseFieldArrayAppend<PurchaseFormValues, "items">
  remove: UseFieldArrayRemove
  isLoading: boolean
  errors: FieldErrors<PurchaseFormValues>
}

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
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Purchase items</CardTitle>

        <CardDescription>
          Add products, quantities, and purchase prices.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border bg-muted/20 p-4">
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_120px_140px_auto] sm:items-end">
              {/* Product */}
              <Controller
                control={control}
                name={`items.${index}.productId`}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Product</FieldLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          disabled={isLoading}
                          aria-invalid={fieldState.invalid}
                          className="w-full justify-between font-normal"
                        >
                          <span className="truncate">
                            {field.value
                              ? (() => {
                                  const product = products.find(
                                    (product) => product.id === field.value
                                  )

                                  return product
                                    ? `${product.name} · ${product.sku}`
                                    : "Choose a product"
                                })()
                              : "Choose a product"}
                          </span>

                          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent
                        align="start"
                        className="w-(--radix-popover-trigger-width) p-0"
                      >
                        <Command>
                          <CommandInput placeholder="Search products..." />

                          <CommandList>
                            <CommandEmpty>No product found.</CommandEmpty>

                            <CommandGroup>
                              {products.map((product) => (
                                <CommandItem
                                  key={product.id}
                                  value={`${product.name} ${product.sku}`}
                                  onSelect={() => field.onChange(product.id)}
                                >
                                  <div className="flex min-w-0 flex-col">
                                    <span className="truncate">
                                      {product.name}
                                    </span>

                                    <span className="text-xs text-muted-foreground">
                                      {product.sku}
                                    </span>
                                  </div>

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
                )}
              />

              {/* Quantity */}
              <Controller
                control={control}
                name={`items.${index}.quantity`}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Quantity</FieldLabel>

                    <Input
                      {...field}
                      type="number"
                      min={1}
                      disabled={isLoading}
                      onChange={(event) =>
                        field.onChange(event.target.valueAsNumber)
                      }
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Unit price */}
              <Controller
                control={control}
                name={`items.${index}.unitPrice`}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Unit price</FieldLabel>

                    <Input
                      {...field}
                      type="number"
                      step="any"
                      min={0}
                      disabled={isLoading}
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Remove */}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="text-muted-foreground hover:text-destructive"
                aria-label="Remove item"
                disabled={fields.length === 1 || isLoading}
                onClick={() => remove(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}

        {errors.items?.root && (
          <p className="text-sm text-destructive">
            {errors.items.root.message}
          </p>
        )}

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            append({
              productId: "",
              quantity: 1,
              unitPrice: "",
            })
          }
          disabled={isLoading}
        >
          <Plus className="size-4" />
          Add item
        </Button>
      </CardContent>
    </Card>
  )
}
