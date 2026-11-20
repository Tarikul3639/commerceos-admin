"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Permission } from "@/config/permissions.config"
import { usePermission } from "@/hooks/use-permission"
import { useGetProductsQuery } from "@/features/products/api/product.api"
import { useGetSuppliersQuery } from "@/features/suppliers/api/supplier.api"

import {
  useCreatePurchaseMutation,
  useUpdatePurchaseMutation,
} from "../../api/purchase.api"
import type { Purchase } from "../../types/purchase.types"
import {
  purchaseSchema,
  type PurchaseFormValues,
} from "../../schemas/purchase.schema"

import { PurchaseInformation } from "./purchase-information"
import { PurchaseItems } from "./purchase-items"
import { PurchasePricing } from "./purchase-pricing"

interface PurchaseFormProps {
  purchase?: Purchase | null
  onSuccess?: () => void
}

/** Builds and submits the shared create/update purchase form. */
export function PurchaseForm({ purchase, onSuccess }: PurchaseFormProps) {
  const router = useRouter()
  const isUpdate = Boolean(purchase)
  const permission = usePermission()
  const canSubmit = isUpdate
    ? permission.has(Permission.PURCHASE_UPDATE)
    : permission.has(Permission.PURCHASE_CREATE)

  const { data: supplierData, isLoading: isLoadingSuppliers } =
    useGetSuppliersQuery({ limit: 100, isActive: true })
  const { data: productData, isLoading: isLoadingProducts } =
    useGetProductsQuery({ limit: 100, status: "PUBLISHED" })

  const suppliers = supplierData?.data ?? []
  const products = productData?.data ?? []

  const [createPurchase, { isLoading: isCreating }] =
    useCreatePurchaseMutation()
  const [updatePurchase, { isLoading: isUpdating }] =
    useUpdatePurchaseMutation()

  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      supplierId: purchase?.supplier.id ?? "",
      items: purchase?.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })) ?? [{ productId: "", quantity: 1, unitPrice: "" }],
      discount: purchase?.discount ?? "0",
      tax: purchase?.tax ?? "0",
    },
  })

  // Keep the form in sync when the loaded purchase changes.
  useEffect(() => {
    if (!purchase) return

    form.reset({
      supplierId: purchase.supplier.id,
      items: purchase.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      discount: purchase.discount,
      tax: purchase.tax,
    })
  }, [purchase, form])

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  const values = useWatch({ control: form.control })
  const isLoading = isCreating || isUpdating
  const isDirty = form.formState.isDirty

  // Derive totals from watched values so the summary updates immediately.
  const subtotal = (values.items ?? []).reduce(
    (sum, item) =>
      sum + Number(item.unitPrice || 0) * Number(item.quantity || 0),
    0
  )
  const discount = Number(values.discount || 0)
  const tax = Number(values.tax || 0)
  const total = subtotal - discount + tax

  /** Validates business rules and sends the appropriate mutation. */
  const submit = async (data: PurchaseFormValues) => {
    if (!canSubmit) return

    const subtotalValue = data.items.reduce(
      (sum, item) => sum + Number(item.unitPrice) * item.quantity,
      0
    )

    if (Number(data.discount || 0) > subtotalValue) {
      form.setError("discount", {
        message: "Discount cannot exceed subtotal",
      })
      return
    }

    const body = {
      supplierId: data.supplierId,
      items: data.items.map(({ productId, quantity, unitPrice }) => ({
        productId,
        quantity,
        unitPrice,
      })),
      discount: data.discount || "0",
      tax: data.tax || "0",
    }

    try {
      if (purchase) {
        await updatePurchase({ id: purchase.id, data: body }).unwrap()
        toast.success("Purchase updated successfully")
        onSuccess?.()
        router.push(`/dashboard/purchases/${purchase.id}`)
        return
      }

      await createPurchase(body).unwrap()
      toast.success("Purchase created successfully")
      onSuccess?.()
      router.push("/dashboard/purchases")
    } catch (error) {
      toast.error(
        purchase ? "Unable to update purchase" : "Unable to create purchase",
        {
          description:
            (error as { data?: { message?: string } })?.data?.message ??
            "Please try again.",
        }
      )
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(submit)}
      className="w-full min-w-0 space-y-6"
    >
      <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <PurchaseInformation
            control={form.control}
            suppliers={suppliers}
            isLoading={isLoading || isLoadingSuppliers}
          />

          <PurchaseItems
            control={form.control}
            fields={fields}
            products={products}
            append={append}
            remove={remove}
            isLoading={isLoading || isLoadingProducts}
            errors={form.formState.errors}
          />
        </div>

        <aside className="space-y-4 xl:sticky xl:top-6">
          <PurchasePricing
            control={form.control}
            subtotal={subtotal}
            total={total}
            discount={discount}
            tax={tax}
            isLoading={isLoading}
          />

          <div className="rounded-xl border bg-card p-4">
            <p className="text-sm font-medium">Before you save</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Review the supplier, item quantities, and purchase prices. Stock
              is recorded when this purchase is received.
            </p>
          </div>
        </aside>
      </div>

      <div className="sticky bottom-0 z-0 flex min-w-0 -mx-3 flex-col-reverse gap-3 border-t bg-background/95 p-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          {isUpdate
            ? isDirty
              ? "You have unsaved changes."
              : "No changes to save."
            : "Check all details before creating this purchase."}
        </p>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() =>
              router.push(
                purchase
                  ? `/dashboard/purchases/${purchase.id}`
                  : "/dashboard/purchases"
              )
            }
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !canSubmit || (isUpdate && !isDirty)}
          >
            {isLoading
              ? "Saving..."
              : isUpdate
                ? "Save changes"
                : "Create purchase"}
          </Button>
        </div>
      </div>
    </form>
  )
}
