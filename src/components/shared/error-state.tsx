import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
    title?: string
    message?: string
    onRetry?: () => void
    className?: string
}

/** Displays a reusable error state with an optional retry action. */
export function ErrorState({
    title = "Something went wrong",
    message = "Failed to load data. Please try again.",
    onRetry,
    className,
}: ErrorStateProps) {
    return (
        <div
            className={`flex min-h-60 flex-col items-center justify-center gap-3 text-center ${className ?? ""}`}
            role="alert"
        >
            <AlertCircle className="size-8 text-destructive" aria-hidden="true" />

            <div className="space-y-1">
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="max-w-md text-sm text-muted-foreground">{message}</p>
            </div>

            {onRetry && (
                <Button type="button" variant="outline" size="sm" onClick={onRetry}>
                    <RefreshCw className="mr-2 size-4" />
                    Try again
                </Button>
            )}
        </div>
    )
}
