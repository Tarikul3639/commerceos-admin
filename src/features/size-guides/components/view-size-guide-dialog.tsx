"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import type { SizeGuide } from "../types/size-guide.types"

export function ViewSizeGuideDialog({
  sizeGuide,
  open,
  onOpenChange,
}: {
  sizeGuide: SizeGuide | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!sizeGuide) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader><DialogTitle>Size Guide Details</DialogTitle></DialogHeader>
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div><p className="text-sm text-muted-foreground">Name</p><p className="font-medium">{sizeGuide.name}</p></div>
            <div><p className="text-sm text-muted-foreground">Unit</p><p className="font-medium">{sizeGuide.unit}</p></div>
            <div><p className="text-sm text-muted-foreground">Sizes</p><p className="font-medium">{sizeGuide.rows.length}</p></div>
          </div>
          <div><p className="text-sm text-muted-foreground">Description</p><p className="text-sm">{sizeGuide.description || "No description"}</p></div>
          <Separator />
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader><TableRow>{sizeGuide.columns.map((column) => <TableHead key={column}>{column}</TableHead>)}</TableRow></TableHeader>
              <TableBody>
                {sizeGuide.rows.map((row, index) => (
                  <TableRow key={index}>{sizeGuide.columns.map((column) => <TableCell key={column}>{row[column] ?? "—"}</TableCell>)}</TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground">Created {new Date(sizeGuide.createdAt).toLocaleDateString()}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
