import type { LucideIcon } from "lucide-react"

import {
  BarChart3,
  Bell,
  Boxes,
  ChartNoAxesCombined,
  ClipboardList,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Store,
  Tags,
  RotateCcw,
  UserCog,
  Users,
} from "lucide-react"

import { Permission } from "@/config/permissions.config"

export interface NavigationItem {
  title: string
  href: string
  icon: LucideIcon
  permission?: Permission
}

export interface NavigationGroup {
  title: string
  items: NavigationItem[]
}

export const navigation: NavigationGroup[] = [
  // ─────────────────────────────────────────────
  // Overview
  // ─────────────────────────────────────────────

  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        permission: Permission.DASHBOARD_READ,
      },
      {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: ChartNoAxesCombined,
        permission: Permission.ANALYTICS_READ,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Management
  // ─────────────────────────────────────────────

  {
    title: "Management",
    items: [
      {
        title: "Users",
        href: "/dashboard/users",
        icon: Users,
        permission: Permission.USER_READ,
      },
      {
        title: "Permissions",
        href: "/dashboard/permissions",
        icon: UserCog,
        permission: Permission.PERMISSION_READ,
      },
      {
        title: "Customers",
        href: "/dashboard/customers",
        icon: Users,
        permission: Permission.CUSTOMER_READ,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Catalog
  // ─────────────────────────────────────────────

  {
    title: "Catalog",
    items: [
      {
        title: "Products",
        href: "/dashboard/products",
        icon: Package,
        permission: Permission.PRODUCT_READ,
      },
      {
        title: "Categories",
        href: "/dashboard/categories",
        icon: Boxes,
        permission: Permission.CATEGORY_READ,
      },
      {
        title: "Brands",
        href: "/dashboard/brands",
        icon: Tags,
        permission: Permission.BRAND_READ,
      },
      {
        title: "Discounts",
        href: "/dashboard/discounts",
        icon: Tags,
        permission: Permission.DISCOUNT_READ,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Inventory
  // ─────────────────────────────────────────────

  {
    title: "Inventory",
    items: [
      {
        title: "Stock",
        href: "/dashboard/stock",
        icon: Boxes,
        permission: Permission.STOCK_READ,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Purchasing
  // ─────────────────────────────────────────────

  {
    title: "Purchasing",
    items: [
      {
        title: "Purchases",
        href: "/dashboard/purchases",
        icon: ClipboardList,
        permission: Permission.PURCHASE_READ,
      },
      {
        title: "Returns",
        href: "/dashboard/purchase-returns",
        icon: RotateCcw,
        permission: Permission.PURCHASE_READ,
      },
      {
        title: "Suppliers",
        href: "/dashboard/suppliers",
        icon: Store,
        permission: Permission.SUPPLIER_READ,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Sales
  // ─────────────────────────────────────────────

  {
    title: "Sales",
    items: [
      {
        title: "Orders",
        href: "/dashboard/orders",
        icon: ShoppingCart,
        permission: Permission.ORDER_READ,
      },
      {
        title: "Carts",
        href: "/dashboard/carts",
        icon: ShoppingCart,
        permission: Permission.CART_READ,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Marketing
  // ─────────────────────────────────────────────

  {
    title: "Marketing",
    items: [
      {
        title: "Banners",
        href: "/dashboard/banners",
        icon: LayoutDashboard,
        permission: Permission.BANNER_READ,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // System
  // ─────────────────────────────────────────────

  {
    title: "System",
    items: [
      {
        title: "Activity Logs",
        href: "/dashboard/activity-logs",
        icon: ClipboardList,
        permission: Permission.ACTIVITY_LOG_READ,
      },
      {
        title: "Notifications",
        href: "/dashboard/notifications",
        icon: Bell,
        permission: Permission.NOTIFICATION_READ,
      },
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        permission: Permission.SETTING_READ,
      },
    ],
  },
]
