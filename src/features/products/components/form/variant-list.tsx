"use client"

import {
  Barcode,
  Boxes,
  Loader2,
  Search,
  SquarePen,
  Trash2,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import type { ProductOption } from "../../types/product-option.types"
import type { ProductVariant } from "../../types/product-variant.types"

type Props = {
  variants: ProductVariant[]
  productOptions: ProductOption[]
  isLoading: boolean
  isError: boolean
  search: string
  deletingId: string | null
  editingId: string | null
  onSearchChange: (value: string) => void
  onRetry: () => void
  onEdit: (variant: ProductVariant) => void
  onDelete: (variant: ProductVariant) => void
}

const getVariantLabel = (variant: ProductVariant, options: ProductOption[]) =>
  options
    .flatMap((option) => {
      const value = option.values.find(
        (item) => item.id === variant.options[option.id]
      )
      return value ? [`${option.name}: ${value.label}`] : []
    })
    .join(" · ") || "Default product variant"

export function VariantList({
  variants,
  productOptions,
  isLoading,
  isError,
  search,
  deletingId,
  editingId,
  onSearchChange,
  onRetry,
  onEdit,
  onDelete,
}: Props) {
  const query = search.trim().toLowerCase()
  const filteredVariants = variants.filter((variant) =>
    [
      variant.sku,
      variant.barcode ?? "",
      getVariantLabel(variant, productOptions),
    ].some((value) => value.toLowerCase().includes(query))
  )

  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="space-y-1">
          <CardTitle className="text-base">Variants</CardTitle>
          <CardDescription>
            Each variant represents a sellable combination with its own SKU,
            barcode and inventory.
          </CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1 sm:max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search combination, SKU or barcode"
              className="pl-9"
            />
          </div>
          <Badge variant="outline" className="tabular-nums">
            {filteredVariants.length} of {variants.length}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <Alert variant="destructive">
            <AlertTitle>Unable to load variants</AlertTitle>
            <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
              <span>Refresh the variant list and try again.</span>
              <Button size="sm" variant="outline" onClick={onRetry}>
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        ) : filteredVariants.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-muted/10 px-5 py-12 text-center">
            <Boxes className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 font-medium">
              {variants.length === 0
                ? "No variants yet"
                : "No matching variants"}
            </p>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              {variants.length === 0
                ? "Create a variant manually or generate all available option combinations."
                : "Try another search term."}
            </p>
          </div>
        ) : (
          filteredVariants.map((variant) => (
            <div
              key={variant.id}
              id={`variant-${variant.sku}`}
              className="rounded-lg border bg-card p-4 transition-colors"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">
                        {getVariantLabel(variant, productOptions)}
                      </p>
                      <Badge
                        variant={variant.isActive ? "secondary" : "outline"}
                      >
                        {variant.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {productOptions.map((option) => {
                        const selected = option.values.find(
                          (value) => value.id === variant.options[option.id]
                        )
                        if (!selected) return null
                        return (
                          <Badge
                            key={option.id}
                            variant="outline"
                            className="font-normal"
                          >
                            {option.name}: {selected.label}
                          </Badge>
                        )
                      })}
                      {productOptions.length === 0 && (
                        <Badge variant="outline">Standard product</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => onEdit(variant)}
                      disabled={!!editingId || !!deletingId}
                    >
                      <SquarePen className="size-3" />
                      Update
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => onDelete(variant)}
                      disabled={!!deletingId || !!editingId}
                      aria-label={`Delete variant ${variant.sku}`}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      {deletingId === variant.id ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <Trash2 className="size-3" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3 rounded-md bg-muted/20 p-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="min-w-0 space-y-1">
                    <p className="text-xs text-muted-foreground">SKU</p>
                    <p className="font-mono text-sm break-all">{variant.sku}</p>
                  </div>
                  <div className="min-w-0 space-y-1">
                    <p className="text-xs text-muted-foreground">Barcode</p>
                    <p className="flex items-center gap-1.5 font-mono text-sm break-all">
                      <Barcode className="size-3.5 shrink-0 text-muted-foreground" />
                      {variant.barcode || "Not assigned"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Available stock
                    </p>
                    <p className="text-sm font-semibold tabular-nums">
                      {variant.stock}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Availability
                    </p>
                    <p className="text-sm">
                      {variant.stock > 0 ? "In stock" : "Out of stock"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
