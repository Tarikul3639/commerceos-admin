"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2, Plus, Sparkles } from "lucide-react"
import { toast } from "sonner"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  useDeleteProductVariantMutation,
  useGetProductVariantsQuery,
} from "../../api/product-variant-api"
import {
  useGenerateProductVariantsMutation,
  useGetProductOptionsQuery,
} from "../../api/product-option-api"

import { getErrorMessage } from "@/lib/utils/error"
import type { ProductOption } from "../../types/product-option.types"
import type {
  GeneratedVariantRequest,
  ProductVariant,
  VariantOptions,
} from "../../types/product-variant.types"
import {
  generateInternalBarcode,
  generateSku,
} from "../../utils/variant-identifiers"
import { VariantEditDialog } from "./variant-edit-dialog"
import { VariantList } from "./variant-list"

type Props = {
  productId: string
  productName: string
}

const sameCombination = (
  first: VariantOptions,
  second: VariantOptions,
  optionIds: string[]
) => optionIds.every((id) => first[id] === second[id])

const getCombinations = (options: ProductOption[]): VariantOptions[] => {
  if (options.length === 0) return [{}]

  return options.reduce<VariantOptions[]>(
    (combinations, option) =>
      combinations.flatMap((combination) =>
        option.values.map((value) => ({
          ...combination,
          [option.id]: value.id,
        }))
      ),
    [{}]
  )
}

export function ProductVariants({ productId, productName }: Props) {
  const searchParams = useSearchParams()
  const targetSku = searchParams.get("sku")

  const {
    data: productOptions = [],
    isLoading: isLoadingOptions,
    isError: isOptionsError,
  } = useGetProductOptionsQuery(productId)

  const {
    data: variants = [],
    isLoading: isLoadingVariants,
    isError: isVariantsError,
    refetch: refetchVariants,
  } = useGetProductVariantsQuery(productId)

  const [generateVariants, { isLoading: isGenerating }] =
    useGenerateProductVariantsMutation()
  const [deleteVariant] = useDeleteProductVariantMutation()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(
    null
  )
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const optionIds = useMemo(
    () => productOptions.map((option) => option.id),
    [productOptions]
  )
  const allCombinationsGenerated = useMemo(() => {
    if (
      productOptions.length === 0 ||
      productOptions.some((option) => option.values.length === 0)
    )
      return false

    const combinations = getCombinations(productOptions)
    return (
      combinations.length > 0 &&
      combinations.every((combination) =>
        variants.some((variant) =>
          sameCombination(variant.options, combination, optionIds)
        )
      )
    )
  }, [productOptions, variants, optionIds])

  useEffect(() => {
    if (!targetSku || isLoadingVariants) return

    let timeout: number | undefined
    const frame = requestAnimationFrame(() => {
      const row = document.getElementById(`variant-${targetSku}`)
      if (!row) return

      row.scrollIntoView({ behavior: "smooth", block: "center" })
      row.classList.add("bg-primary/10", "outline", "outline-primary/40")
      timeout = window.setTimeout(() => {
        row.classList.remove("bg-primary/10", "outline", "outline-primary/40")
        const url = new URL(window.location.href)
        url.searchParams.delete("sku")
        window.history.replaceState({}, "", url.toString())
      }, 2500)
    })

    return () => {
      cancelAnimationFrame(frame)
      if (timeout !== undefined) window.clearTimeout(timeout)
    }
  }, [targetSku, isLoadingVariants, variants])

  const createIdentifierPreview = (selection: VariantOptions) => {
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
  }

  const handleDelete = async (variant: ProductVariant) => {
    setDeletingId(variant.id)
    try {
      await deleteVariant({ productId, variantId: variant.id }).unwrap()
      toast.success("Variant deleted")
    } catch (error) {
      toast.error("Unable to delete variant", {
        description: getErrorMessage(error),
      })
    } finally {
      setDeletingId(null)
    }
  }

  const handleGenerate = async () => {
    if (productOptions.some((option) => option.values.length === 0)) {
      toast.error(
        "Add at least one value to every option before generating variants"
      )
      return
    }

    const combinations = getCombinations(productOptions)
    const missing = combinations.filter(
      (combination) =>
        !variants.some((variant) =>
          sameCombination(variant.options, combination, optionIds)
        )
    )

    if (missing.length === 0) {
      toast.info("All available combinations already exist")
      return
    }
    if (missing.length > 500) {
      toast.error("You can generate up to 500 variants at a time")
      return
    }

    const generated: GeneratedVariantRequest[] = missing.map((combination) => ({
      ...createIdentifierPreview(combination),
      options: combination,
    }))

    try {
      await generateVariants({ productId, variants: generated }).unwrap()
      toast.success(`${generated.length} variants generated`)
    } catch (error) {
      toast.error("Unable to generate variants", {
        description: getErrorMessage(error),
      })
    }
  }

  return (
    <div className="space-y-5">
      {isLoadingOptions ? (
        <div className="flex items-center gap-2 rounded-lg border p-4 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading product options...
        </div>
      ) : isOptionsError ? (
        <Alert variant="destructive">
          <AlertTitle>Options could not be loaded</AlertTitle>
          <AlertDescription>
            Refresh the page before creating variants.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {variants.length} {variants.length === 1 ? "variant" : "variants"}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => void handleGenerate()}
                  disabled={
                    isGenerating ||
                    isLoadingVariants ||
                    productOptions.length === 0 ||
                    allCombinationsGenerated
                  }
                  aria-label="Generate missing combinations"
                >
                  {isGenerating ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Generate missing combinations</p>
              </TooltipContent>
            </Tooltip>
            <Button
              type="button"
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              disabled={isLoadingVariants}
            >
              <Plus className="size-4" />
              Create variant
            </Button>
          </div>
        </div>
      )}

      <VariantList
        variants={variants}
        productOptions={productOptions}
        isLoading={isLoadingVariants}
        isError={isVariantsError}
        search={search}
        deletingId={deletingId}
        editingId={editingVariant?.id ?? null}
        onSearchChange={setSearch}
        onRetry={() => void refetchVariants()}
        onEdit={setEditingVariant}
        onDelete={(variant) => void handleDelete(variant)}
      />

      <VariantEditDialog
        productId={productId}
        productName={productName}
        variant={editingVariant}
        variants={variants}
        productOptions={productOptions}
        open={isCreateOpen || !!editingVariant}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false)
            setEditingVariant(null)
          }
        }}
      />
    </div>
  )
}
