"use client"

import { PageContainer } from "@/components/layout/page-container"
import { DataTable } from "@/components/data-table"
import { useGetRolesPermissionsQuery } from "../api/permissions.api"
import { columns } from "./permissions-columns"
import { rolePermissions } from "../permissions.data"

export function PermissionsContent() {
  let {
    data: rolesPermissions,
    isLoading,
    isFetching,
  } = useGetRolesPermissionsQuery()

  // rolesPermissions = rolePermissions

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
