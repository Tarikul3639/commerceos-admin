import type { Permission } from "@/config/permissions.config"
import { Role } from "@/config/roles.config"

export interface RolePermissions {
    role: Role
    permissions: Permission[]
}

export interface UpdateRolePermissionsPayload {
    permissions: Permission[]
}