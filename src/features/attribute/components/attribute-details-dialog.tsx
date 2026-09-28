"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

import type { Attribute } from "../types/attribute.types"

interface AttributeDetailsDialogProps {
    attribute: Attribute
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AttributeDetailsDialog({
    attribute,
    open,
    onOpenChange,
}: AttributeDetailsDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-2xl font-semibold">
                        {attribute.name}
                    </DialogTitle>

                    <DialogDescription>
                        Attribute details and available values.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <Separator />

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">
                                Values
                            </p>

                            <Badge variant="secondary">
                                {attribute.values.length}
                            </Badge>
                        </div>

                        {attribute.values.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {attribute.values.map((item) => (
                                    <Badge
                                        key={item.id}
                                        variant="outline"
                                    >
                                        {item.value}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-md border border-dashed px-4 py-6 text-center">
                                <p className="text-sm text-muted-foreground">
                                    No values added yet.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}