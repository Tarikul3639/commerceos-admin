"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { PageLoader } from "@/components/shared/page-loader"
import { AppShell } from "@/components/layout/app-shell"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      const callbackUrl = encodeURIComponent(pathname)
      router.replace(`/login?callbackUrl=${callbackUrl}`)
    }
  }, [isAuthenticated, isLoading, pathname, router, user])

  if (isLoading || !isAuthenticated || !user) {
    return <PageLoader />
  }

  return <AppShell>{children}</AppShell>
}
