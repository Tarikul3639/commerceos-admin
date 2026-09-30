"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { getErrorMessage } from "@/lib/utils/error"

import { useCreateSizeChartItemMutation } from "../api/size-chart.api"
import type { SizeChartItemFormValues } from "../schemas/size-chart.schema"
import type { CreateSizeChartItemRequest } from "../types/size-chart.types"
import { SizeChartItemForm } from "./size-chart-item-form"

export function CreateSizeChartItemDialog({
    sizeChartId,
}: {
    sizeChartId: string
}) {
    const [open, setOpen] = useState(false)
    const [createItem, { isLoading }] = useCreateSizeChartItemMutation()
    const handleSubmit = async (values: SizeChartItemFormValues) => {
        try {
            const data: CreateSizeChartItemRequest = {
                size: values.size,
            }

            for (const field of [
                "chest",
                "length",
                "shoulder",
                "sleeve",
                "waist",
                "hip",
                "inseam",
            ] as const) {
                if (typeof values[field] === "number") {
                    data[field] = values[field]
                }
            }

            await createItem({
                sizeChartId,
                data,
            }).unwrap()

            toast.success("Size added successfully")
            setOpen(false)
        } catch (error) {
            toast.error(getErrorMessage(error) || "Failed to add size")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    Add Size
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Add Size</DialogTitle>
                    <DialogDescription>
                        Add the measurements for this size.
                    </DialogDescription>
                </DialogHeader>

                <SizeChartItemForm
                    onSubmit={handleSubmit}
                    onCancel={() => setOpen(false)}
                    isLoading={isLoading}
                />
            </DialogContent>
        </Dialog>
    )
}
