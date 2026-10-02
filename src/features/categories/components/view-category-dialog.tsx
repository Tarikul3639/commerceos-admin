"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import type { Category } from "../types/categories.types"

interface ViewCategoryDialogProps {
  category: Category | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewCategoryDialog({
  category,
  open,
  onOpenChange,
}: ViewCategoryDialogProps) {
  if (!category) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Category Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{category.name}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Slug</p>
            <p className="font-mono text-sm">{category.slug}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="text-sm">
              {category.description || "No description"}
            </p>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="mt-1">
                <Badge variant={category.isActive ? "default" : "secondary"}>
                  {category.isActive ? "Active" : "Inactive"}
                </Badge>
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="mt-1 text-sm">
                {new Date(category.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Last Updated</p>
            <p className="text-sm">
              {new Date(category.updatedAt).toLocaleDateString("bn-BD", {
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
      </DialogContent>
    </Dialog>
  )
}
