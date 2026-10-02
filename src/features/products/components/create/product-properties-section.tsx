"use client"

import { useState } from "react"
import type { Control } from "react-hook-form"
import { Controller } from "react-hook-form"
import { ChevronDown, ChevronsUpDown, X } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useGetCategoriesQuery } from "@/features/categories/api/categories.api"
import { useGetBrandsQuery } from "@/features/brands/api/brands.api"

import type { ProductFormValues } from "../../schemas/product.schema"

interface Props {
  control: Control<ProductFormValues>
  disabled?: boolean
}

const DEFAULT_SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"]

export function ProductPropertiesSection({ control, disabled = false }: Props) {
  const [open, setOpen] = useState(true)
  const [sizeOptions, setSizeOptions] = useState(DEFAULT_SIZE_OPTIONS)
  const [customSize, setCustomSize] = useState("")

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery()

  const { data: brandsData, isLoading: brandsLoading } = useGetBrandsQuery()

  const categories = categoriesData?.data ?? []
  const brands = brandsData?.data ?? []

  const addCustomSize = (
    onChange: (value: string[]) => void,
    sizes: string[]
  ) => {
    const size = customSize.trim()

    if (!size || sizeOptions.includes(size)) return

    setSizeOptions((options) => [...options, size])
    onChange([...sizes, size])
    setCustomSize("")
  }

  return (
    <Card>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CardHeader>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="group flex w-full items-center justify-between text-left"
            >
              <div className="space-y-1">
                <CardTitle>Properties</CardTitle>
                <CardDescription>
                  Set catalog placement, colors, and sizes.
                </CardDescription>
              </div>

              <ChevronDown className="size-4 shrink-0 transition-transform duration-200 ease-out group-data-[state=open]:rotate-180" />
            </button>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent className="mt-3 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <CardContent className="pt-0">
            <FieldGroup className="grid gap-5 md:grid-cols-2">
              <Controller
                name="sku"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>SKU</FieldLabel>
                    <Input
                      {...field}
                      placeholder="SKU-001"
                      disabled={disabled}
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="barcode"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Barcode</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder="e.g. 1234567890123"
                      disabled={disabled}
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="categoryId"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Category</FieldLabel>

                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={disabled || categoriesLoading}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            categoriesLoading
                              ? "Loading categories..."
                              : "Select category"
                          }
                        />
                      </SelectTrigger>

                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="brandId"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Brand</FieldLabel>

                    <Select
                      value={field.value || "none"}
                      onValueChange={(value) =>
                        field.onChange(value === "none" ? "" : value)
                      }
                      disabled={disabled || brandsLoading}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            brandsLoading ? "Loading brands..." : "Select brand"
                          }
                        />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="none">No brand</SelectItem>

                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="sizes"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Sizes</FieldLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={disabled}
                          className="w-full justify-between font-normal"
                        >
                          <span className="truncate">
                            {field.value.length
                              ? field.value.join(", ")
                              : "Select sizes"}
                          </span>

                          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent
                        align="start"
                        className="w-(--radix-popover-trigger-width) p-2"
                      >
                        <div className="space-y-2">
                          <div className="grid grid-cols-3 gap-1">
                            {sizeOptions.map((size) => (
                              <label
                                key={size}
                                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 transition-colors hover:bg-muted"
                              >
                                <Checkbox
                                  checked={field.value.includes(size)}
                                  onCheckedChange={(checked) =>
                                    field.onChange(
                                      checked
                                        ? [...field.value, size]
                                        : field.value.filter(
                                            (item) => item !== size
                                          )
                                    )
                                  }
                                  disabled={disabled}
                                />

                                <span className="text-sm">{size}</span>
                              </label>
                            ))}
                          </div>

                          <div className="flex gap-2 border-t pt-2">
                            <Input
                              value={customSize}
                              onChange={(event) =>
                                setCustomSize(event.target.value)
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault()
                                  addCustomSize(field.onChange, field.value)
                                }
                              }}
                              placeholder="Add custom size"
                              disabled={disabled}
                            />

                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                addCustomSize(field.onChange, field.value)
                              }
                              disabled={disabled || !customSize.trim()}
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="colors"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Colors</FieldLabel>

                    <div className="space-y-2">
                      {field.value.map((color, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={color.name}
                            onChange={(event) => {
                              const colors = [...field.value]

                              colors[index] = {
                                ...colors[index],
                                name: event.target.value,
                              }

                              field.onChange(colors)
                            }}
                            placeholder="Color name"
                            disabled={disabled}
                          />

                          <Input
                            type="color"
                            value={color.hex}
                            onChange={(event) => {
                              const colors = [...field.value]

                              colors[index] = {
                                ...colors[index],
                                hex: event.target.value,
                              }

                              field.onChange(colors)
                            }}
                            disabled={disabled}
                            className="h-10 w-14 cursor-pointer p-0.5"
                          />

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() =>
                              field.onChange(
                                field.value.filter(
                                  (_, colorIndex) => colorIndex !== index
                                )
                              )
                            }
                            disabled={disabled}
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          field.onChange([
                            ...field.value,
                            {
                              name: "",
                              hex: "#000000",
                            },
                          ])
                        }
                        disabled={disabled}
                      >
                        Add color
                      </Button>
                    </div>

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
