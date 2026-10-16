"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Check, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface UnsavedChangesBarProps {
    open: boolean
    isSaving?: boolean
    position?: "top" | "bottom"
    message?: string
    saveLabel?: string
    discardLabel?: string
    onSave: () => void
    onDiscard: () => void
    className?: string
}

export function UnsavedChangesBar({
    open,
    isSaving = false,
    position,
    message = "You have unsaved changes.",
    saveLabel = "Save",
    discardLabel = "Discard",
    onSave,
    onDiscard,
    className,
}: UnsavedChangesBarProps) {
    const [mounted, setMounted] = useState(open)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (!open) {
            setVisible(false)
            return
        }

        setMounted(true)

        const frame = requestAnimationFrame(() => {
            setVisible(true)
        })

        return () => cancelAnimationFrame(frame)
    }, [open])

    const handleTransitionEnd = (
        event: React.TransitionEvent<HTMLDivElement>
    ) => {
        if (
            event.target === event.currentTarget &&
            event.propertyName === "opacity" &&
            !open
        ) {
            setMounted(false)
        }
    }

    if (!mounted) return null

    const positionClass = position
        ? position === "bottom"
            ? "bottom-4 sm:bottom-5"
            : "top-16"
        : "bottom-5"

    const hiddenPositionClass = position
        ? position === "bottom"
            ? "translate-y-4"
            : "-translate-y-4"
        : "-translate-y-4 sm:translate-y-4"

    return (
        <div
            role="region"
            aria-label="Unsaved changes"
            onTransitionEnd={handleTransitionEnd}
            className={cn(
                "fixed left-1/2 z-50",
                "w-max max-w-[calc(100vw-1.5rem)]",
                "-translate-x-1/2",
                "transform-gpu will-change-[opacity,transform]",
                "transition-[opacity,transform] duration-300",
                "ease-[cubic-bezier(0.22,1,0.36,1)]",
                "motion-reduce:transition-none",
                positionClass,
                visible
                    ? "translate-y-0 opacity-100"
                    : cn(hiddenPositionClass, "opacity-0"),
                "rounded-full border bg-background/95 p-1.5",
                "shadow-lg backdrop-blur-md",
                className
            )}
        >
            <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="flex min-w-0 items-center gap-2 pl-1.5 sm:pl-2">
                    <AlertCircle className="size-4 shrink-0 text-amber-500" />

                    <span className="hidden max-w-48 truncate text-xs text-muted-foreground sm:block">
                        {message}
                    </span>

                    <span className="text-xs font-medium sm:hidden">Unsaved changes</span>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isSaving}
                        onClick={onDiscard}
                        className="h-8 rounded-full! px-2.5 text-xs sm:px-3"
                    >
                        <RotateCcw className="mr-1 size-3.5" />
                        {discardLabel}
                    </Button>

                    <Button
                        type="button"
                        size="xs"
                        disabled={isSaving}
                        onClick={onSave}
                        className="h-8 rounded-full! px-3 text-xs sm:px-3.5"
                    >
                        <Check className="ml-0.5 size-3.5" />
                        {isSaving ? "Saving..." : saveLabel}
                    </Button>
                </div>
            </div>
        </div>
    )
}
