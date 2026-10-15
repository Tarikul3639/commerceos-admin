import type { Metadata } from "next"
import { Suspense } from "react"

import { LoginContent } from "@/features/auth/components/login-content"
import { LoadingState } from "@/components/shared/loading-state"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to access your CommerceOS dashboard.",
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <LoginContent />
    </Suspense>
  )
}