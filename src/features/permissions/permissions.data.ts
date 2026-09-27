import { Role } from "@/config/roles.config"
import { Permission } from "@/config/permissions.config"
import type { RolePermissions } from "./types/permissions.types"

export const rolePermissions: RolePermissions[] = [
  {
    role: Role.ADMIN,
    permissions: [
      Permission.PRODUCT_READ,
      Permission.PRODUCT_CREATE,
      Permission.PRODUCT_UPDATE,
      Permission.PRODUCT_DELETE,
      Permission.ORDER_READ,
      Permission.ORDER_CREATE,
      Permission.ORDER_UPDATE,
      Permission.STOCK_READ,
      Permission.STOCK_UPDATE,
    ],
  },
  {
    role: Role.MANAGER,
    permissions: [
      Permission.PRODUCT_READ,
      Permission.PRODUCT_CREATE,
      Permission.PRODUCT_UPDATE,
      Permission.ORDER_READ,
      Permission.ORDER_CREATE,
      Permission.ORDER_UPDATE,
      Permission.STOCK_READ,
      Permission.STOCK_UPDATE,
    ],
  },
  {
    role: Role.EMPLOYEE,
    permissions: [
      Permission.PRODUCT_READ,
      Permission.ORDER_READ,
      Permission.ORDER_CREATE,
      Permission.STOCK_READ,
    ],
  },
]
