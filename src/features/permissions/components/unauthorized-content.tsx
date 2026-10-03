"use client"

import Link from "next/link"
import { ArrowLeft, Home, ShieldX } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

export function UnauthorizedContent() {
  const router = useRouter()

  return (
    <main className="flex items-center justify-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/10 sm:size-14">
          <ShieldX
            className="size-6 text-destructive/70 sm:size-7"
            strokeWidth={1.75}
          />
        </div>

        <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground">
          ERROR 403
        </p>

        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Access denied
        </h1>

        <p className="mx-auto mt-2 max-w-xs text-sm leading-5 text-muted-foreground sm:max-w-sm sm:leading-6">
          You don&apos;t have permission to access this page. Please contact
          your administrator if you believe you should have access.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Button asChild size="sm">
            <Link href="/dashboard">
              <Home className="size-4" />
              Go to dashboard
            </Link>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="size-4" />
            Go back
          </Button>
        </div>
      </div>
    </main>
  )
}
