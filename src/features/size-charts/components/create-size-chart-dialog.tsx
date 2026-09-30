"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/lib/utils/error"

import { useCreateSizeChartMutation } from "../api/size-chart.api"
import type { SizeChartFormValues } from "../schemas/size-chart.schema"
import { SizeChartForm } from "./size-chart-form"

export function CreateSizeChartDialog() {
    const [open, setOpen] = useState(false)
    const [createSizeChart, { isLoading }] = useCreateSizeChartMutation()

    const handleSubmit = async (values: SizeChartFormValues) => {
        try {
            await createSizeChart(values).unwrap()
            toast.success("Size chart created successfully")
            setOpen(false)
        } catch (error) {
            toast.error(getErrorMessage(error) || "Failed to create size chart")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button variant="default" size="sm">
                            <Plus />
                            Create
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>

                <TooltipContent>
                    <p>Create a new size chart</p>
                </TooltipContent>
            </Tooltip>


            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create Size Chart</DialogTitle>
                    <DialogDescription>Add a reusable size chart to your catalog.</DialogDescription>
                </DialogHeader>
                <SizeChartForm
                    onSubmit={handleSubmit}
                    onCancel={() => setOpen(false)}
                    submitLabel="Create"
                    isLoading={isLoading}
                />
            </DialogContent>
        </Dialog>
    )
}
