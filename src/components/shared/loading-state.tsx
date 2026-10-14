
import { LoaderCircle } from "lucide-react"

interface LoadingStateProps {
    message?: string
    className?: string
}

/** Displays a reusable loading state. */
export function LoadingState({
    message = "Loading...",
    className,
}: LoadingStateProps) {
    return (
        <div
            className={`flex min-h-60 flex-col items-center justify-center gap-3 ${className ?? ""}`}
            role="status"
            aria-live="polite"
        >
            <LoaderCircle
                className="size-6 animate-spin text-muted-foreground"
                aria-hidden="true"
            />

            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    )
}
