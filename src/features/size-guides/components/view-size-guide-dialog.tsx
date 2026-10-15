"use client"

import {
  Dialog,
  DialogContent,
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
      <DialogContent className="flex max-h-[85dvh] flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle>Size Guide Details</DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain">
          <div className="grid grid-cols-3 gap-3">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="wrap-break-word text-sm font-medium">
                {sizeGuide.name}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Unit</p>
              <p className="text-sm font-medium uppercase">
                {sizeGuide.unit}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Sizes</p>
              <p className="text-sm font-medium">
                {sizeGuide.rows.length}
              </p>
            </div>
          </div>

          {sizeGuide.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {sizeGuide.description}
            </p>
          )}

          <div className="max-w-full overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {sizeGuide.columns.map((column, index) => (
                    <TableHead
                      key={`${column}-${index}`}
                      className="h-9 whitespace-nowrap"
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
                          className="whitespace-nowrap py-2"
                        >
                          {row[column] ?? "—"}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={Math.max(sizeGuide.columns.length, 1)}
                      className="py-4 text-center text-sm text-muted-foreground"
                    >
                      No measurements available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
