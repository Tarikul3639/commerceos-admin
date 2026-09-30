"use client"

import { toast } from "sonner"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { getErrorMessage } from "@/lib/utils/error"

import { useUpdateSizeChartItemMutation } from "../api/size-chart.api"
import type { SizeChartItemFormValues } from "../schemas/size-chart.schema"
import type { CreateSizeChartItemRequest, SizeChartItem } from "../types/size-chart.types"
import { SizeChartItemForm } from "./size-chart-item-form"

export function EditSizeChartItemDialog({
    sizeChartId,
    item,
    open,
    onOpenChange,
}: {
    sizeChartId: string
    item: SizeChartItem | null
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const [updateItem, { isLoading }] = useUpdateSizeChartItemMutation()
    if (!item) return null

    const handleSubmit = async (values: SizeChartItemFormValues) => {
        try {
            const data: CreateSizeChartItemRequest = { size: values.size }
            for (const field of ["chest", "length", "shoulder", "sleeve", "waist", "hip", "inseam"] as const) {
                if (typeof values[field] === "number") data[field] = values[field]
            }
            await updateItem({ sizeChartId, itemId: item.id, data }).unwrap()
            toast.success("Size chart item updated successfully")
            onOpenChange(false)
        } catch (error) {
            toast.error(getErrorMessage(error) || "Failed to update size chart item")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader><DialogTitle>Update Size</DialogTitle></DialogHeader>
                <SizeChartItemForm
                    key={item.id}
                    item={item}
                    onSubmit={handleSubmit}
                    onCancel={() => onOpenChange(false)}
                    isLoading={isLoading}
                />
            </DialogContent>
        </Dialog>
    )
}
