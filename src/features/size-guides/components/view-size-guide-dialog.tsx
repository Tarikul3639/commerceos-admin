"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type { SizeGuide } from "../types/size-guide.types"

interface ViewSizeGuideDialogProps {
  sizeGuide: SizeGuide | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewSizeGuideDialog({
  sizeGuide,
  open,
  onOpenChange,
}: ViewSizeGuideDialogProps) {
  if (!sizeGuide) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80dvh] max-w-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>Size Guide Details</DialogTitle>
          <DialogDescription>
            View the size guide information and measurement chart.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 space-y-4 overflow-y-auto overscroll-contain">
          <div className="grid grid-cols-3 gap-3 rounded-md border p-3">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="mt-1 wrap-break-word text-sm font-medium">
                {sizeGuide.name}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Unit</p>
              <p className="mt-1 text-sm font-medium uppercase">
                {sizeGuide.unit}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Sizes</p>
              <p className="mt-1 text-sm font-medium tabular-nums">
                {sizeGuide.rows.length}
              </p>
            </div>
          </div>

          {sizeGuide.description ? (
            <div className="space-y-1">
              <p className="text-sm font-medium">Description</p>
              <p className="whitespace-pre-wrap wrap-break-word text-sm text-muted-foreground">
                {sizeGuide.description}
              </p>
            </div>
          ) : null}

          <div className="space-y-2">
            <p className="text-sm font-medium">Measurement chart</p>
            {sizeGuide.columns.length > 0 ? (
              <div className="max-w-full overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {sizeGuide.columns.map((column, index) => (
                        <TableHead
                          key={`${column}-${index}`}
                          className="h-9 whitespace-nowrap text-center"
                        >
                          {column}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sizeGuide.rows.length > 0 ? (
                      sizeGuide.rows.map((row, index) => (
                        <TableRow key={index}>
                          {sizeGuide.columns.map((column, columnIndex) => (
                            <TableCell
                              key={`${column}-${columnIndex}`}
                              className="py-2 whitespace-nowrap text-center"
                            >
                              {row[column] ?? "—"}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={sizeGuide.columns.length}
                          className="py-6 text-center text-sm text-muted-foreground"
                        >
                          No measurements available.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="rounded-md border border-dashed py-6 text-center text-sm text-muted-foreground">
                No measurement columns available.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}