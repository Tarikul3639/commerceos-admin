"use client"

import { useCallback } from "react"

import { Permission } from "@/config/permissions.config"
import { Role } from "@/config/roles.config"
import { useAppSelector } from "@/store/hooks"

export function usePermission() {
  const user = useAppSelector((state) => state.auth.user)

  const has = useCallback(
    (permission: Permission): boolean => {
      if (!user) {
        return false
      }

      if (user.role === Role.SUPER_ADMIN) {
        return true
      }

      return user.permissions.includes(permission)
    },
    [user]
  )

  const hasAny = useCallback(
    (permissions: Permission[]): boolean => {
      if (!user) {
        return false
      }

      if (user.role === Role.SUPER_ADMIN) {
        return true
      }

      return permissions.some((permission) =>
        user.permissions.includes(permission)
      )
    },
    [user]
  )

  const hasAll = useCallback(
    (permissions: Permission[]): boolean => {
      if (!user) {
        return false
      }

      if (user.role === Role.SUPER_ADMIN) {
        return true
      }

      return permissions.every((permission) =>
        user.permissions.includes(permission)
      )
    },
    [user]
  )

  return {
    role: user?.role ?? null,
    has,
    hasAny,
    hasAll,
  }
}
