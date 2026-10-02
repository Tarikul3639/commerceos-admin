import { Fragment } from "react"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
    label: string
    href?: string
}

interface PageContainerProps {
    children: React.ReactNode
    access?: boolean
    accessFallback?: React.ReactNode

    title?: string
    breadcrumbs?: BreadcrumbItem[]
    infoContent?: React.ReactNode
    pageHeaderAction?: React.ReactNode

    className?: string
}

export function PageContainer({
    children,
    access = true,
    accessFallback,

    title,
    breadcrumbs,
    infoContent,
    pageHeaderAction,

    className,
}: PageContainerProps) {
    if (!access) {
        return (
            <main
                className={cn(
                    "flex flex-1 flex-col p-4 md:p-6",
                    className
                )}
            >
                {accessFallback}
            </main>
        )
    }

    return (
        <main
            className={cn(
                "flex flex-1 flex-col gap-5",
                className
            )}
        >
            {/* Page Header */}
            {(title || breadcrumbs || infoContent || pageHeaderAction) && (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 flex-col gap-2">
                            {title && (
                                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                                    {title}
                                </h1>
                            )}

                            {breadcrumbs && (
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        {breadcrumbs.map((item, index) => (
                                            <Fragment key={item.label}>
                                                <BreadcrumbItem>
                                                    {item.href ? (
                                                        <BreadcrumbLink
                                                            href={item.href}
                                                        >
                                                            {item.label}
                                                        </BreadcrumbLink>
                                                    ) : (
                                                        <BreadcrumbPage>
                                                            {item.label}
                                                        </BreadcrumbPage>
                                                    )}
                                                </BreadcrumbItem>

                                                {index <
                                                    breadcrumbs.length - 1 && (
                                                    <BreadcrumbSeparator />
                                                )}
                                            </Fragment>
                                        ))}
                                    </BreadcrumbList>
                                </Breadcrumb>
                            )}
                        </div>

                        {pageHeaderAction && (
                            <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                                {pageHeaderAction}
                            </div>
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