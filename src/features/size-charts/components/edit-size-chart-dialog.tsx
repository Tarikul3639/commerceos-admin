"use client"

import { toast } from "sonner"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { getErrorMessage } from "@/lib/utils/error"

import { useUpdateSizeChartMutation } from "../api/size-chart.api"
import type { SizeChartFormValues } from "../schemas/size-chart.schema"
import type { SizeChart } from "../types/size-chart.types"
import { SizeChartForm } from "./size-chart-form"

export function EditSizeChartDialog({
    sizeChart,
    open,
    onOpenChange,
}: {
    sizeChart: SizeChart | null
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const [updateSizeChart, { isLoading }] = useUpdateSizeChartMutation()
    if (!sizeChart) return null

    const handleSubmit = async (values: SizeChartFormValues) => {
        try {
            await updateSizeChart({ id: sizeChart.id, data: values }).unwrap()
            toast.success("Size chart updated successfully")
            onOpenChange(false)
        } catch (error) {
            toast.error(getErrorMessage(error) || "Failed to update size chart")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Update Size Chart</DialogTitle>
                    <DialogDescription>Update the size chart name.</DialogDescription>
                </DialogHeader>
                <SizeChartForm
                    key={sizeChart.id}
                    sizeChart={sizeChart}
                    onSubmit={handleSubmit}
                    onCancel={() => onOpenChange(false)}
                    submitLabel="Update"
                    isLoading={isLoading}
                />
            </DialogContent>
        </Dialog>
    )
}
