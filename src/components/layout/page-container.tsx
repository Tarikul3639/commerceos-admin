import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface PageContainerProps {
  children: React.ReactNode
  access?: boolean
  accessFallback?: React.ReactNode

  pageTitle?: string
  pageDescription?: string
  infoContent?: React.ReactNode
  pageHeaderAction?: React.ReactNode

  className?: string
}

export function PageContainer({
  children,
  access = true,
  accessFallback,

  pageTitle,
  pageDescription,
  infoContent,
  pageHeaderAction,

  className,
}: PageContainerProps) {
  if (!access) {
    return (
      <main className={cn("flex flex-1 flex-col p-4 md:p-6", className)}>
        {accessFallback}
      </main>
    )
  }

  return (
    <main className={cn("flex flex-1 flex-col gap-3 px-1", className)}>
      {/* Page Header */}
      {(pageTitle || pageDescription || infoContent || pageHeaderAction) && (
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              {pageTitle && (
                <h1 className="text-2xl font-semibold tracking-tight">
                  {pageTitle}
                </h1>
              )}

              {pageDescription && (
                <p className="text-sm text-muted-foreground">
                  {pageDescription}
                </p>
              )}
            </div>

            {pageHeaderAction && (
              <div className="shrink-0">{pageHeaderAction}</div>
            )}
          </div>

          {infoContent && <div>{infoContent}</div>}
        </div>
      )}

      {/* Page Content */}
      {children}
    </main>
  )
}
