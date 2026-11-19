import { Permission } from "./permissions.config"

export type PermissionAction =
  "Read" | "Create" | "Update" | "Delete" | "Restore"

interface PermissionGroup {
  [groupName: string]: Partial<Record<PermissionAction, Permission>>
}

export const permissionGroups: PermissionGroup = {
  Dashboard: {
    Read: Permission.DASHBOARD_READ,
  },

  Analytics: {
    Read: Permission.ANALYTICS_READ,
  },

  Products: {
    Read: Permission.PRODUCT_READ,
    Create: Permission.PRODUCT_CREATE,
    Update: Permission.PRODUCT_UPDATE,
    Delete: Permission.PRODUCT_DELETE,
    Restore: Permission.PRODUCT_RESTORE,
  },

  Discounts: {
    Read: Permission.DISCOUNT_READ,
    Create: Permission.DISCOUNT_CREATE,
    Update: Permission.DISCOUNT_UPDATE,
    Delete: Permission.DISCOUNT_DELETE,
  },

  Orders: {
    Read: Permission.ORDER_READ,
    Create: Permission.ORDER_CREATE,
    Update: Permission.ORDER_UPDATE,
    Delete: Permission.ORDER_DELETE,
  },

  Customers: {
    Read: Permission.CUSTOMER_READ,
    Create: Permission.CUSTOMER_CREATE,
    Update: Permission.CUSTOMER_UPDATE,
    Delete: Permission.CUSTOMER_DELETE,
  },

  Suppliers: {
    Read: Permission.SUPPLIER_READ,
    Create: Permission.SUPPLIER_CREATE,
    Update: Permission.SUPPLIER_UPDATE,
    Delete: Permission.SUPPLIER_DELETE,
  },

  Purchases: {
    Read: Permission.PURCHASE_READ,
    Create: Permission.PURCHASE_CREATE,
    Update: Permission.PURCHASE_UPDATE,
    Delete: Permission.PURCHASE_DELETE,
  },

  "Purchase Returns": {
    Read: Permission.PURCHASE_READ,
    Create: Permission.PURCHASE_CREATE,
    Update: Permission.PURCHASE_UPDATE,
    Delete: Permission.PURCHASE_RETURN_DELETE,
  },

  Categories: {
    Read: Permission.CATEGORY_READ,
    Create: Permission.CATEGORY_CREATE,
    Update: Permission.CATEGORY_UPDATE,
    Delete: Permission.CATEGORY_DELETE,
  },

  Brands: {
    Read: Permission.BRAND_READ,
    Create: Permission.BRAND_CREATE,
    Update: Permission.BRAND_UPDATE,
    Delete: Permission.BRAND_DELETE,
  },

  Stock: {
    Read: Permission.STOCK_READ,
    Create: Permission.STOCK_CREATE,
    Update: Permission.STOCK_UPDATE,
    Delete: Permission.STOCK_DELETE,
  },

  Banners: {
    Read: Permission.BANNER_READ,
    Create: Permission.BANNER_CREATE,
    Update: Permission.BANNER_UPDATE,
    Delete: Permission.BANNER_DELETE,
  },

  Carts: {
    Read: Permission.CART_READ,
  },

  Users: {
    Read: Permission.USER_READ,
    Create: Permission.USER_CREATE,
    Update: Permission.USER_UPDATE,
    Delete: Permission.USER_DELETE,
  },

  Permissions: {
    Read: Permission.PERMISSION_READ,
    Update: Permission.PERMISSION_UPDATE,
  },

  "Activity Logs": {
    Read: Permission.ACTIVITY_LOG_READ,
  },

  Emails: {
    Read: Permission.EMAIL_READ,
  },

  Notifications: {
    Read: Permission.NOTIFICATION_READ,
    Create: Permission.NOTIFICATION_CREATE,
    Update: Permission.NOTIFICATION_UPDATE,
    Delete: Permission.NOTIFICATION_DELETE,
  },

  Settings: {
    Read: Permission.SETTING_READ,
    Update: Permission.SETTING_UPDATE,
  },
} as const
