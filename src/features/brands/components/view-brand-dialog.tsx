"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AppImage } from "@/components/media"

import type { Brand } from "../types/brands.types"

interface ViewBrandDialogProps {
  brand: Brand
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewBrandDialog({
  brand,
  open,
  onOpenChange,
}: ViewBrandDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Brand Details</DialogTitle>

          <DialogDescription>View the details of this brand.</DialogDescription>
        </DialogHeader>
        <DialogHeader>
          <div className="flex justify-center">
            <AppImage
              name={brand.name}
              image={brand.image}
              className="size-24 text-2xl"
            />
          </div>

          <DialogTitle className="text-center">{brand.name}</DialogTitle>

          <DialogDescription className="text-center">
            View the details of this brand.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Slug</p>
            <p className="text-sm text-muted-foreground">{brand.slug}</p>
          </div>

          <Separator />

          <div className="space-y-1">
            <p className="text-sm font-medium">Description</p>
            <p className="text-sm text-muted-foreground">
              {brand.description || "—"}
            </p>
          </div>

          <Separator />

          <div className="space-y-1">
            <p className="text-sm font-medium">Status</p>

            <Badge variant={brand.isActive ? "default" : "secondary"}>
              {brand.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Created</p>
              <p className="text-sm text-muted-foreground">
                {new Date(brand.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Updated</p>
              <p className="text-sm text-muted-foreground">
                {new Date(brand.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour12: true,
                  hour: "numeric",
                  minute: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
