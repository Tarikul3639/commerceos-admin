"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

import { useGetSupplierQuery } from "../api/supplier.api"

interface SupplierDetailsDialogProps {
  id: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SupplierDetailsDialog({
  id,
  open,
  onOpenChange,
}: SupplierDetailsDialogProps) {
  const { data, isLoading, isError } = useGetSupplierQuery(id ?? "", {
    skip: !id || !open,
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supplier details</DialogTitle>
          <DialogDescription>
            Contact information and account status.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading supplier...</p>
        ) : isError ? (
          <p className="text-sm text-destructive">
            Unable to load supplier details.
          </p>
        ) : (
          data && (
            <dl className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["Name", data.name],
                  ["Email", data.email],
                  ["Phone", data.phone],
                  ["Contact person", data.contactPerson],
                  ["Address", data.address],
                  [
                    "Created",
                    new Date(data.createdAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      hour12: true,
                    }),
                  ],
                ] as const
              ).map(([label, value]) => (
                <div key={label}>
                  <dt className="text-sm text-muted-foreground">{label}</dt>

                  <dd className="mt-1 text-sm font-medium wrap-break-word">
                    {value || "—"}
                  </dd>
                </div>
              ))}

              <div>
                <dt className="text-sm text-muted-foreground">Status</dt>

                <dd className="mt-1">
                  <Badge variant={data.isActive ? "default" : "secondary"}>
                    {data.isActive ? "Active" : "Inactive"}
                  </Badge>
                </dd>
              </div>
            </dl>
          )
        )}
      </DialogContent>
    </Dialog>
  )
}
