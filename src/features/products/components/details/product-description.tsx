"use client"

interface ProductDescriptionProps {
    description: string | null
}

export function ProductDescription({ description }: ProductDescriptionProps) {
    return (
        <div className="min-h-50 max-w-4xl p-3 md:p-4">
            {description ? (
                <div className="whitespace-pre-wrap text-sm leading-7">
                    {description}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">
                    No description available.
                </p>
            )}
        </div>
    )
}