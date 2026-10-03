"use client"

import { useEffect } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

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

export function PurchaseForm({ purchase, onSuccess }: PurchaseFormProps) {
  const isUpdate = Boolean(purchase)

  const { data: supplierData } = useGetSuppliersQuery({
    limit: 100,
    isActive: true,
  })

  const suppliers = supplierData?.data ?? []

  const { data: productData } = useGetProductsQuery({
    limit: 100,
    isActive: true,
  })

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
      })) ?? [
        {
          productId: "",
          quantity: 1,
          unitPrice: "",
        },
      ],
      discount: purchase?.discount ?? "0",
      tax: purchase?.tax ?? "0",
    },
  })

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

  const isLoading = isCreating || isUpdating
  const values = form.watch()

  const subtotal = values.items.reduce(
    (sum, item) =>
      sum + Number(item.unitPrice || 0) * Number(item.quantity || 0),
    0
  )

  const total =
    subtotal - Number(values.discount || 0) + Number(values.tax || 0)

  const submit = async (data: PurchaseFormValues) => {
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
        await updatePurchase({
          id: purchase.id,
          data: body,
        }).unwrap()

        toast.success("Purchase updated successfully")
      } else {
        await createPurchase(body).unwrap()

        toast.success("Purchase created successfully")
        form.reset({
          supplierId: "",
          items: [
            {
              productId: "",
              quantity: 1,
              unitPrice: "",
            },
          ],
          discount: "0",
          tax: "0",
        })
      }

      onSuccess?.()
    } catch (error) {
      toast.error(
        purchase ? "Unable to update purchase" : "Unable to create purchase",
        {
          description:
            (
              error as {
                data?: {
                  message?: string
                }
              }
            )?.data?.message ?? "Please try again.",
        }
      )
    }
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-5">
      <PurchaseInformation
        control={form.control}
        suppliers={suppliers}
        isLoading={isLoading}
      />

      <PurchaseItems
        control={form.control}
        fields={fields}
        products={products}
        append={append}
        remove={remove}
        isLoading={isLoading}
        errors={form.formState.errors}
      />

      <PurchasePricing
        control={form.control}
        subtotal={subtotal}
        total={total}
        values={values}
        isLoading={isLoading}
      />

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={() => form}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : isUpdate ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  )
}
