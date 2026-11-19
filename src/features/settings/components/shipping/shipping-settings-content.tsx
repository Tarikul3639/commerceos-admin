"use client"

import { useEffect, useState } from "react"
import { Plus, RefreshCw } from "lucide-react"
import { toast } from "sonner"

import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { PageContainer } from "@/components/layout/page-container"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Permission } from "@/config/permissions.config"
import { UnauthorizedContent } from "@/features/permissions/components/unauthorized-content"
import { usePermission } from "@/hooks/use-permission"
import { cn } from "@/lib/utils"
import { getErrorMessage } from "@/lib/utils/error"

import {
  useCreateShippingZoneMutation,
  useDeleteShippingZoneMutation,
  useGetShippingSettingsQuery,
  useUpdateShippingSettingsMutation,
  useUpdateShippingZoneMutation,
} from "../../api/shipping-settings.api"
import type {
  ShippingZone,
  ShippingZonePayload,
} from "../../types/shipping-settings.types"
import { ShippingThresholdCard } from "./shipping-threshold-card"
import { ShippingZoneFormDialog } from "./shipping-zone-form-dialog"
import { ShippingZoneList } from "./shipping-zone-list"

const breadcrumbs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Settings", href: "/dashboard/settings" },
  { label: "Shipping" },
]

export function ShippingSettingsContent() {
  const permission = usePermission()
  const canUpdate = permission.has(Permission.SETTING_UPDATE)

  const { data, isLoading, isFetching, error, refetch } =
    useGetShippingSettingsQuery()

  const [updateSettings, { isLoading: isSavingSettings }] =
    useUpdateShippingSettingsMutation()
  const [createZone, { isLoading: isCreatingZone }] =
    useCreateShippingZoneMutation()
  const [updateZone, { isLoading: isUpdatingZone }] =
    useUpdateShippingZoneMutation()
  const [deleteZone, { isLoading: isDeletingZone }] =
    useDeleteShippingZoneMutation()

  const [threshold, setThreshold] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ShippingZone | null>(null)

  useEffect(() => {
    if (data) setThreshold(data.freeShippingThreshold ?? "")
  }, [data])

  const isSavingZone = isCreatingZone || isUpdatingZone

  async function handleThresholdSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()
    try {
      await updateSettings({
        freeShippingThreshold:
          threshold.trim() === "" ? null : Number(threshold),
      }).unwrap()
      toast.success("Shipping threshold updated")
    } catch (error) {
      toast.error(
        getErrorMessage(error) || "Unable to update shipping threshold"
      )
    }
  }

  function handleAddZone() {
    setEditingZone(null)
    setDialogOpen(true)
  }

  function handleEditZone(zone: ShippingZone) {
    setEditingZone(zone)
    setDialogOpen(true)
  }

  async function handleSaveZone(values: ShippingZonePayload) {
    try {
      if (editingZone) {
        await updateZone({ id: editingZone.id, data: values }).unwrap()
        toast.success("Shipping zone updated")
      } else {
        await createZone(values).unwrap()
        toast.success("Shipping zone created")
      }
      setDialogOpen(false)
      setEditingZone(null)
    } catch (error) {
      toast.error(getErrorMessage(error) || "Unable to save shipping zone")
    }
  }

  async function handleDeleteZone() {
    if (!deleteTarget) return
    try {
      await deleteZone(deleteTarget.id).unwrap()
      toast.success("Shipping zone deleted")
      setDeleteTarget(null)
    } catch (error) {
      toast.error(getErrorMessage(error) || "Unable to delete shipping zone")
    }
  }

  return (
    <PageContainer
      access={permission.has(Permission.SETTING_READ)}
      accessFallback={<UnauthorizedContent />}
      title="Shipping Settings"
      breadcrumbs={breadcrumbs}
      pageHeaderAction={
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={cn("size-4", isFetching && "animate-spin")} />
            Refresh
          </Button>

          {canUpdate && (
            <Button
              onClick={handleAddZone}
              size="sm"
              className="w-fit self-end"
            >
              <Plus />
              Shipping Zone
            </Button>
          )}
        </div>
      }
    >
      <div className="mx-auto w-full space-y-7">
        <ShippingThresholdCard
          value={threshold}
          onChange={setThreshold}
          onSubmit={handleThresholdSubmit}
          canUpdate={canUpdate}
          isSaving={isSavingSettings}
        />

        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-base font-semibold tracking-tight">
                Delivery zones
              </h2>
              <p className="text-sm text-muted-foreground">
                Set a flat delivery fee for each district or city you serve.
              </p>
            </div>
          </div>

          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Could not load shipping settings</AlertTitle>
              <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
                <span>Shipping zones are temporarily unavailable.</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void refetch()}
                  disabled={isFetching}
                >
                  Try again
                </Button>
              </AlertDescription>
            </Alert>
          ) : isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-56 rounded-xl" />
              ))}
            </div>
          ) : (
            <div
              className={cn("transition-opacity", isFetching && "opacity-70")}
            >
              <ShippingZoneList
                zones={data?.zones ?? []}
                canUpdate={canUpdate}
                onEdit={handleEditZone}
                onDelete={setDeleteTarget}
                onAdd={handleAddZone}
              />
            </div>
          )}
        </section>

        <Alert>
          <AlertTitle>Checkout integration pending</AlertTitle>
          <AlertDescription className="text-xs leading-relaxed">
            Shipping rates and the free-shipping threshold are saved as store
            settings. They are not yet applied to order totals or checkout; this
            will be connected when the customer checkout and address flow is
            implemented.
          </AlertDescription>
        </Alert>
      </div>

      <ShippingZoneFormDialog
        open={dialogOpen}
        zone={editingZone}
        isSubmitting={isSavingZone}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open && !isSavingZone) setEditingZone(null)
        }}
        onSubmit={handleSaveZone}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete shipping zone"
        description={
          <>
            Delete <strong>{deleteTarget?.districtCity}</strong>? This cannot be
            undone.
          </>
        }
        confirmLabel={isDeletingZone ? "Deleting..." : "Delete"}
        onConfirm={handleDeleteZone}
      />
    </PageContainer>
  )
}
