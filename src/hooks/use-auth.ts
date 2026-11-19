"use client"

import { useEffect } from "react"

import { useGetCurrentUserQuery } from "@/features/auth/auth.api"
import { setUser } from "@/store/slices/auth.slice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"

export function useAuth() {
  const dispatch = useAppDispatch()

  const user = useAppSelector((state) => state.auth.user)

  const { data, isLoading, isError } = useGetCurrentUserQuery()

  useEffect(() => {
    if (data) {
      dispatch(setUser(data))
    }
  }, [data, dispatch])

  // Use the query result immediately instead of waiting for the Redux effect.
  // This prevents the dashboard guard from redirecting during the render
  // between a successful /me response and the setUser dispatch.
  const authenticatedUser = user ?? data ?? null

  return {
    user: authenticatedUser,
    isLoading,
    isAuthenticated: !!authenticatedUser,
    isError,
  }
}
