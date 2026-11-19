import { MapPin, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

import type { ShippingZone } from "../../types/shipping-settings.types"
import { ShippingZoneCard } from "./shipping-zone-card"

interface ShippingZoneListProps {
  zones: ShippingZone[]
  canUpdate: boolean
  onEdit: (zone: ShippingZone) => void
  onDelete: (zone: ShippingZone) => void
  onAdd: () => void
}

export function ShippingZoneList({
  zones,
  canUpdate,
  onEdit,
  onDelete,
  onAdd,
}: ShippingZoneListProps) {
  if (zones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/10 px-6 py-12 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <MapPin className="size-6" />
        </span>
        <h3 className="mt-4 text-sm font-semibold">No shipping zones yet</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Add your first district or city to start configuring delivery rates.
        </p>
        {canUpdate && (
          <Button size="sm" className="mt-5" onClick={onAdd}>
            <Plus className="size-4" />
            Create shipping zone
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {zones.map((zone) => (
        <ShippingZoneCard
          key={zone.id}
          zone={zone}
          canUpdate={canUpdate}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
