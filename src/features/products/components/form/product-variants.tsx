"use client"

import { useState } from "react"
import {
  Loader2,
  Save,
  Trash2,
  X,
  Pencil,
  SavePlus,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  useCreateProductVariantMutation,
  useDeleteProductVariantMutation,
  useGetProductVariantsQuery,
  useUpdateProductVariantMutation,
} from "../../api/product-variant-api"
import {
  useGetProductOptionsQuery,
  useGenerateProductVariantsMutation,
} from "../../api/product-option-api"

import type {
  CreateProductVariantRequest,
  ProductVariant,
} from "../../types/product-variant.types"

type ProductVariantsProps = {
  productId: string
}

type VariantForm = {
  title: string
  sku: string
  barcode: string
  stock: string
  optionValueIds: string[]
}

type EditableVariant = {
  title: string
  sku: string
  barcode: string
  stock: string
  optionValueIds: string[]
}

const emptyForm: VariantForm = {
  title: "",
  sku: "",
  barcode: "",
  stock: "0",
  optionValueIds: [],
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "data" in error) {
    const data = error.data

    if (data && typeof data === "object" && "message" in data) {
      const message = data.message

      if (typeof message === "string") return message
      if (Array.isArray(message)) return message.join(", ")
    }
  }

  return "Something went wrong. Please try again."
}

function toEditableVariant(variant: ProductVariant): EditableVariant {
  return {
    title: variant.title ?? "",
    sku: variant.sku,
    barcode: variant.barcode ?? "",
    stock: String(variant.stock),
    optionValueIds: [],
  }
}

export function ProductVariants({ productId }: ProductVariantsProps) {
  const {
    data: productOptions = [],
    isLoading: isLoadingOptions,
    isError: isOptionsError,
  } = useGetProductOptionsQuery(productId)
  const {
    data: variants = [],
    isLoading,
    isError: isVariantsError,
  } = useGetProductVariantsQuery(productId)

  const [generateVariants, { isLoading: isGenerating }] =
    useGenerateProductVariantsMutation()
  const [createVariant, { isLoading: isCreating }] =
    useCreateProductVariantMutation()
  const [updateVariant, { isLoading: isUpdating }] =
    useUpdateProductVariantMutation()
  const [deleteVariant] = useDeleteProductVariantMutation()

  const [form, setForm] = useState<VariantForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<EditableVariant | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function handleGenerateVariants() {
    generateVariants(productId)
      .unwrap()
      .then(() => {
        toast.success("Variants generated successfully")
      })
      .catch((error) => {
        toast.error(getErrorMessage(error))
      })
  }

  function updateForm<K extends keyof VariantForm>(
    key: K,
    value: VariantForm[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function selectOptionValue(optionIndex: number, valueId: string) {
    setForm((current) => {
      const selected = [...current.optionValueIds]

      if (valueId) {
        selected[optionIndex] = valueId
      } else {
        selected.splice(optionIndex, 1)
      }

      return {
        ...current,
        optionValueIds: selected,
      }
    })
  }

  function selectEditOptionValue(optionIndex: number, valueId: string) {
    setEditForm((current) => {
      if (!current) return current
      const optionValueIds = [...current.optionValueIds]
      optionValueIds[optionIndex] = valueId
      return { ...current, optionValueIds }
    })
  }

  async function handleCreate() {
    const sku = form.sku.trim()
    const stock = Number(form.stock)

    if (!sku) {
      toast.error("SKU is required")
      return
    }

    if (form.stock.trim() === "" || !Number.isInteger(stock) || stock < 0) {
      toast.error("Stock must be a non-negative integer")
      return
    }

    const optionValueIds = form.optionValueIds.filter(Boolean)

    if (
      productOptions.some(
        (option, index) => option.values.length > 0 && !optionValueIds[index]
      )
    ) {
      toast.error("Please select a value for each product option")
      return
    }

    const payload: CreateProductVariantRequest = {
      productId,
      title: form.title.trim() || undefined,
      sku,
      barcode: form.barcode.trim() || undefined,
      stock,
      optionValueIds,
    }

    try {
      await createVariant(payload).unwrap()
      toast.success("Variant created successfully")
      setForm(emptyForm)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  function startEditing(variant: ProductVariant) {
    setEditingId(variant.id)
    const editable = toEditableVariant(variant)
    editable.optionValueIds = productOptions.map(
      (option) =>
        variant.options.find((selected) => selected.optionId === option.id)
          ?.id ?? ""
    )
    setEditForm(editable)
  }

  function cancelEditing() {
    setEditingId(null)
    setEditForm(null)
  }

  async function saveEditing(variant: ProductVariant) {
    if (!editForm) return

    const sku = editForm.sku.trim()
    const stock = Number(editForm.stock)

    if (!sku) {
      toast.error("SKU is required")
      return
    }

    if (editForm.stock.trim() === "" || !Number.isInteger(stock) || stock < 0) {
      toast.error("Stock must be a non-negative integer")
      return
    }

    const optionValueIds = editForm.optionValueIds.filter(Boolean)
    if (
      productOptions.some(
        (option, index) =>
          option.values.length > 0 && !editForm.optionValueIds[index]
      )
    ) {
      toast.error("Please select a value for each product option")
      return
    }

    setSavingId(variant.id)

    try {
      await updateVariant({
        productId,
        variantId: variant.id,
        data: {
          title: editForm.title.trim() || undefined,
          sku,
          barcode: editForm.barcode.trim() || undefined,
          stock,
          optionValueIds,
        },
      }).unwrap()

      toast.success("Variant updated successfully")
      cancelEditing()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSavingId(null)
    }
  }

  async function confirmDelete(variant: ProductVariant) {
    setDeletingId(variant.id)

    try {
      await deleteVariant({
        productId,
        variantId: variant.id,
      }).unwrap()

      toast.success("Variant deleted successfully")

      if (editingId === variant.id) {
        cancelEditing()
      }
      
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setDeletingId(null)
    }
  }

  function getOptionSummary(variant: ProductVariant) {
    return variant.options
      .map((option) => `${option.optionName}: ${option.value}`)
      .join(" · ")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Variant</CardTitle>
          <CardDescription>
            Select values from existing product options and create a variant.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingOptions ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading product options...
            </div>
          ) : isOptionsError ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Unable to load product options. Please refresh and try again.
              </AlertDescription>
            </Alert>
          ) : productOptions.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {productOptions.map((option, index) => (
                <div key={option.id} className="space-y-2">
                  <Label>{option.name}</Label>
                  <Select
                    value={form.optionValueIds[index] ?? ""}
                    onValueChange={(value) =>
                      selectOptionValue(index, value === "all" ? "" : value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={`Select ${option.name}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Select {option.name}</SelectItem>
                      {option.values.map((value) => (
                        <SelectItem key={value.id} value={value.id}>
                          {value.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No product options are configured. You can create a variant
              without option values.
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Title (optional)</Label>
              <Input
                value={form.title}
                onChange={(event) => updateForm("title", event.target.value)}
                placeholder="e.g. Custom configuration"
              />
            </div>

            <div className="space-y-2">
              <Label>SKU *</Label>
              <Input
                value={form.sku}
                onChange={(event) => updateForm("sku", event.target.value)}
                placeholder="Enter SKU"
              />
            </div>

            <div className="space-y-2">
              <Label>Barcode</Label>
              <Input
                value={form.barcode}
                onChange={(event) => updateForm("barcode", event.target.value)}
                placeholder="Enter barcode"
              />
            </div>

            <div className="space-y-2">
              <Label>Stock *</Label>
              <Input
                type="number"
                min={0}
                step={1}
                value={form.stock}
                onChange={(event) => updateForm("stock", event.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <SavePlus />
            )}
            {isCreating ? "Creating..." : "Create"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate">
              Product Variants
            </CardTitle>

            <CardDescription className="truncate">
              {variants.length} variant{variants.length === 1 ? "" : "s"} total.
              Edit values directly in the table.
            </CardDescription>
          </div>

          <Button
            size="sm"
            onClick={() => handleGenerateVariants()}
            disabled={isGenerating || isLoading || isCreating || isUpdating}
          >
            <Sparkles />
            Auto Generate
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="size-6 animate-spin" />
            </div>
          ) : isVariantsError ? (
            <Alert variant="destructive">
              <AlertTitle>Unable to load product variants</AlertTitle>
              <AlertDescription>
                Refresh the page and try again.
              </AlertDescription>
            </Alert>
          ) : variants.length === 0 ? (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <p className="font-medium">No variants yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Select option values above and create your first variant.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Options</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Barcode</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {variants.map((variant) => {
                    const isEditing = editingId === variant.id
                    const isSaving = savingId === variant.id
                    const isDeleting = deletingId === variant.id

                    return (
                      <TableRow key={variant.id}>
                        <TableCell className="min-w-56">
                          {isEditing && editForm ? (
                            <div className="space-y-2">
                              {productOptions.map((option, optionIndex) => (
                                <Select
                                  key={option.id}
                                  value={
                                    editForm.optionValueIds[optionIndex] ?? ""
                                  }
                                  onValueChange={(value) =>
                                    selectEditOptionValue(
                                      optionIndex,
                                      value === "all" ? "" : value
                                    )
                                  }
                                >
                                  <SelectTrigger className="h-8 w-full text-xs">
                                    <SelectValue
                                      placeholder={`Select ${option.name}`}
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="all">
                                      Select {option.name}
                                    </SelectItem>
                                    {option.values.map((value) => (
                                      <SelectItem
                                        key={value.id}
                                        value={value.id}
                                      >
                                        {option.name}: {value.value}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ))}
                            </div>
                          ) : (
                            getOptionSummary(variant) || (
                              <span className="text-muted-foreground">
                                No options
                              </span>
                            )
                          )}
                        </TableCell>

                        <TableCell className="min-w-36">
                          {isEditing && editForm ? (
                            <Input
                              value={editForm.title}
                              onChange={(event) =>
                                setEditForm({
                                  ...editForm,
                                  title: event.target.value,
                                })
                              }
                              placeholder="Title"
                            />
                          ) : (
                            variant.title || "—"
                          )}
                        </TableCell>

                        <TableCell className="min-w-36">
                          {isEditing && editForm ? (
                            <Input
                              value={editForm.sku}
                              onChange={(event) =>
                                setEditForm({
                                  ...editForm,
                                  sku: event.target.value,
                                })
                              }
                            />
                          ) : (
                            variant.sku
                          )}
                        </TableCell>

                        <TableCell className="min-w-36">
                          {isEditing && editForm ? (
                            <Input
                              value={editForm.barcode}
                              onChange={(event) =>
                                setEditForm({
                                  ...editForm,
                                  barcode: event.target.value,
                                })
                              }
                              placeholder="Barcode"
                            />
                          ) : (
                            variant.barcode || "—"
                          )}
                        </TableCell>

                        <TableCell className="min-w-24">
                          {isEditing && editForm ? (
                            <Input
                              type="number"
                              min={0}
                              step={1}
                              value={editForm.stock}
                              onChange={(event) =>
                                setEditForm({
                                  ...editForm,
                                  stock: event.target.value,
                                })
                              }
                            />
                          ) : (
                            variant.stock
                          )}
                        </TableCell>

                        <TableCell>
                          <div className="flex justify-end gap-2">
                            {isEditing ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => saveEditing(variant)}
                                  disabled={isSaving || isUpdating}
                                >
                                  {isSaving ? (
                                    <Loader2 className="mr-1 size-4 animate-spin" />
                                  ) : (
                                    <Save className="mr-1 size-4" />
                                  )}
                                  Save
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={cancelEditing}
                                  disabled={isSaving}
                                >
                                  <X className="mr-1 size-4" />
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  aria-label="Edit variant"
                                  onClick={() => startEditing(variant)}
                                  disabled={!!editingId}
                                >
                                  <Pencil className="size-4" />
                                </Button>

                                <Button
                                  size="icon"
                                  variant="destructive"
                                  aria-label="Delete variant"
                                  onClick={() => void confirmDelete(variant)}
                                  disabled={deletingId === variant.id}
                                >
                                  {deletingId === variant.id ? (
                                    <Loader2 className="size-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="size-4" />
                                  )}
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
