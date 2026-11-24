"use client"

import { useState } from "react"
import {
  Loader2,
  Plus,
  SlidersHorizontal,
  SquarePen,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  useCreateProductOptionMutation,
  useDeleteProductOptionMutation,
  useGetProductOptionsQuery,
  useUpdateProductOptionMutation,
} from "../../api/product-option-api"
import type { ProductOption } from "../../types/product-option.types"
import type { ProductOptionFormValues } from "../../schemas/product-option.schema"
import { getErrorMessage } from "@/lib/utils/error"
import { ProductOptionDialog } from "./product-option-dialog"

interface ProductOptionsProps {
  productId: string
  disabled?: boolean
}

const MAX_PRODUCT_OPTIONS = 2

export function ProductOptions({
  productId,
  disabled = false,
}: ProductOptionsProps) {
  const {
    data: options = [],
    isLoading,
    isError,
    refetch,
  } = useGetProductOptionsQuery(productId, { skip: !productId })

  const [createOption, { isLoading: isCreating }] =
    useCreateProductOptionMutation()
  const [updateOption, { isLoading: isUpdating }] =
    useUpdateProductOptionMutation()
  const [deleteOption, { isLoading: isDeleting }] =
    useDeleteProductOptionMutation()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(
    null
  )

  const busy = disabled || isCreating || isUpdating || isDeleting

  const openCreateDialog = () => {
    setSelectedOption(null)
    setDialogOpen(true)
  }

  const openEditDialog = (option: ProductOption) => {
    setSelectedOption(option)
    setDialogOpen(true)
  }

  const handleSave = async (values: ProductOptionFormValues) => {
    try {
      if (selectedOption) {
        await updateOption({
          productId,
          optionId: selectedOption.id,
          data: { ...values, sortOrder: selectedOption.sortOrder },
        }).unwrap()
        toast.success("Product option updated")
      } else {
        await createOption({
          productId,
          ...values,
          sortOrder: options.length,
        }).unwrap()
        toast.success("Product option created")
      }
      setDialogOpen(false)
    } catch (error) {
      toast.error("Unable to save product option", {
        description: getErrorMessage(error),
      })
    }
  }

  const handleDelete = async (option: ProductOption) => {
    try {
      await deleteOption({ productId, optionId: option.id }).unwrap()
      toast.success("Product option deleted")
    } catch (error) {
      toast.error("Unable to delete product option", {
        description: getErrorMessage(error),
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
          <span>Unable to load product options.</span>
          <Button size="sm" variant="outline" onClick={() => void refetch()}>
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <SlidersHorizontal className="size-4 text-muted-foreground" />
              Product options
            </CardTitle>
            <CardDescription>
              Add up to two option groups, such as Color and Size. Each group
              can have multiple values.
            </CardDescription>
          </div>
          <Badge variant="secondary" className="w-fit tabular-nums">
            {options.length} / {MAX_PRODUCT_OPTIONS} saved
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Options define customer choices. Variants are generated from those
              choices and keep their own SKU, barcode and stock.
            </AlertDescription>
          </Alert>

          {options.length === 0 ? (
            <div className="rounded-lg border border-dashed px-5 py-10 text-center">
              <SlidersHorizontal className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 font-medium">No product options yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Create an option group to define customer choices.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {options.map((option, index) => (
                <Card key={option.id} className="overflow-hidden">
                  <CardHeader className="border-b bg-muted/20 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <CardTitle className="text-sm">
                          Option {index + 1}: {option.name}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {option.type.charAt(0) +
                            option.type.slice(1).toLowerCase()}{" "}
                          · {option.values.length} values
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Saved</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value) => (
                        <Badge
                          key={value.id}
                          variant="secondary"
                          className="h-9 gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 font-normal text-foreground hover:bg-muted/70"
                        >
                          {value.colorCode && (
                            <span
                              className="size-4 shrink-0 rounded-full border border-black/10 shadow-sm"
                              style={{ backgroundColor: value.colorCode }}
                            />
                          )}
                          <span>{value.label}</span>
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between border-t pt-3">
                      <span className="text-xs text-muted-foreground">
                        {option.values.length}{" "}
                        {option.values.length === 1 ? "value" : "values"}
                      </span>

                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => void handleDelete(option)}
                          disabled={busy}
                          className="h-8 gap-1.5 px-2.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          {isDeleting ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                          Delete
                        </Button>

                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(option)}
                          disabled={busy}
                          className="h-8 gap-1.5 px-3"
                        >
                          <SquarePen className="size-3.5" />
                          Update
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {options.length < MAX_PRODUCT_OPTIONS && (
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed"
              onClick={openCreateDialog}
              disabled={busy}
            >
              <Plus className="size-4" />
              Add {options.length === 0 ? "option" : "second option"}
            </Button>
          )}
        </CardContent>
      </Card>

      <ProductOptionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        option={selectedOption}
        isSaving={isCreating || isUpdating}
        onSave={handleSave}
      />
    </>
  )
}
