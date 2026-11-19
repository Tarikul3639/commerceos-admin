import { MapPin, PackageCheck, SquarePen, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

import type { ShippingZone } from "../../types/shipping-settings.types"

interface ShippingZoneCardProps {
  zone: ShippingZone
  canUpdate: boolean
  onEdit: (zone: ShippingZone) => void
  onDelete: (zone: ShippingZone) => void
}

export function ShippingZoneCard({
  zone,
  canUpdate,
  onEdit,
  onDelete,
}: ShippingZoneCardProps) {
  return (
    <Card className="group relative gap-0 overflow-hidden border-border/70 bg-linear-to-br from-primary/5 via-background to-background py-0 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <CardContent className="gap-5 px-5 pt-6 pb-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary ring-1 ring-primary/10">
              <MapPin className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                Delivery zone
              </p>
              <h3 className="mt-0.5 truncate text-base font-semibold tracking-tight">
                {zone.districtCity}
              </h3>
            </div>
          </div>
          <Badge
            variant={zone.isActive ? "default" : "secondary"}
            className="shrink-0 gap-1.5 rounded-full px-2.5"
          >
            <span
              className={
                zone.isActive
                  ? "size-1.5 rounded-full bg-primary-foreground"
                  : "size-1.5 rounded-full bg-muted-foreground"
              }
            />
            {zone.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-muted-foreground">
              Flat delivery rate
            </p>
            <PackageCheck className="size-4 text-muted-foreground/70" />
          </div>
          <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
            <span className="mr-1 text-lg font-medium text-muted-foreground">
              ৳
            </span>
            {Number(zone.rate).toFixed(2)}
          </p>
        </div>
      </CardContent>

      {canUpdate && (
        <CardFooter className="justify-between gap-2 border-t border-border/60 bg-muted/10 px-5 py-3">
          <span className="text-xs text-muted-foreground">
            Zone delivery pricing
          </span>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => onEdit(zone)}
            >
              <SquarePen />
              Update
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(zone)}
              aria-label={`Delete ${zone.districtCity} shipping zone`}
            >
              <Trash2 />
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
