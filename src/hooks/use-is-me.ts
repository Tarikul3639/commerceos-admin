"use client"

import { useAuth } from "@/hooks/use-auth"

export function useIsMe(userId: string) {
  const { user } = useAuth()

  return user?.id === userId
}
