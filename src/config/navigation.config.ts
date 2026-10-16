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
  CreditCard,
  Ruler,
  Store,
  Tags,
  RotateCcw,
  UserCog,
  Users,
  CreditCard as PaymentIcon,
  Truck,
  SlidersHorizontal,
  Settings2,
} from "lucide-react"

import { Permission } from "@/config/permissions.config"

export interface NavigationItem {
  title: string
  href?: string
  icon?: LucideIcon
  permission?: Permission
  children?: NavigationItem[]
}

export interface NavigationGroup {
  title: string
  items: NavigationItem[]
}

export const navigation: NavigationGroup[] = [
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
  {
    title: "Catalog",
    items: [

      {
        title: "Products",
        // href: "/dashboard/products",
        icon: Package,
        permission: Permission.PRODUCT_READ,
        children: [
          {
            title: "List",
            href: "/dashboard/products",
            permission: Permission.PRODUCT_READ,
          },
          {
            title: "Create",
            href: "/dashboard/products/create",
            permission: Permission.PRODUCT_CREATE,
          },
        ],
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
        title: "Size Guides",
        href: "/dashboard/size-guides",
        icon: Ruler,
      },
      {
        title: "Discounts",
        href: "/dashboard/discounts",
        icon: Tags,
        permission: Permission.DISCOUNT_READ,
      },
    ],
  },
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
        title: "Payments",
        href: "/dashboard/payments",
        icon: CreditCard,
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
        icon: Settings2,
        permission: Permission.SETTING_READ,
        children: [
          {
            title: "General",
            href: "/dashboard/settings/general",
            // icon: SlidersHorizontal,
            permission: Permission.SETTING_READ,
          },
          {
            title: "Payments",
            href: "/dashboard/settings/payment-gateways",
            // icon: PaymentIcon,
            permission: Permission.SETTING_READ,
          },
          {
            title: "Shipping",
            href: "/dashboard/settings/shipping",
            // icon: Truck,
            permission: Permission.SETTING_READ,
          },
        ],
      },
    ],
  },
]