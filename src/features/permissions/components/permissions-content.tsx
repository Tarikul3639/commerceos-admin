"use client"

import { PageContainer } from "@/components/layout/page-container"
import { PermissionDenied } from "@/components/shared/permission-denied"
import { Permission } from "@/config/permissions.config"
import { usePermission } from "@/hooks/use-permission"
import { DataTable } from "@/components/data-table"
import { useGetRolesPermissionsQuery } from "../api/permissions.api"
import { columns } from "./permissions-columns"

export function PermissionsContent() {
  const canRead = usePermission().has(Permission.PERMISSION_READ)
  const {
    data: rolesPermissions,
    isLoading,
    isFetching,
  } = useGetRolesPermissionsQuery(undefined, { skip: !canRead })

  if (!canRead) return <PermissionDenied />

  return (
    <PageContainer
      title="Permissions"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Permissions" },
      ]}
    >
      <DataTable
        title="Roles Permissions"
        description="Manage permissions for different roles."
        columns={columns}
        data={rolesPermissions || []}
        isLoading={isLoading || isFetching}
        showPagination={false}
      />
    </PageContainer>
  )
}
