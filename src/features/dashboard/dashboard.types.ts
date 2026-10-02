export interface DashboardQuery {
  startDate?: string
  endDate?: string
  period?: "7d" | "30d" | "3m" | "6m" | "1y"
}

export interface SalesSummary {
  totalSales: string
  todaySales: string
  averageOrderValue: string
  totalOrders: number
  salesGrowth: number
}

export interface StockSummary {
  totalProducts: number
  totalStockQuantity: number
  totalStockValue: string
  lowStockCount: number
  outOfStockCount: number
}

export interface OrderSummary {
  totalOrders: number
  pendingOrders: number
  processingOrders: number
  shippedOrders: number
  deliveredOrders: number
  cancelledOrders: number
}

export interface CustomerSummary {
  totalCustomers: number
  newCustomers: number
  activeCustomers: number
  returningCustomers: number
  customerGrowth: number
}

export interface LowStockProduct {
  sku: string
  productId: string
  productName: string
  productImage?: string | null
  quantity: number
}

export interface RecentUser {
  id: string
  name: string | null
  email: string
  avatar?: string | null
}

export interface RecentActivity {
  id: string
  type: string
  module: string
  action: string
  description: string | null
  entityType: string | null
  entityId: string | null
  userId: string | null
  user: RecentUser | null
  createdAt: string
}

export interface RecentOrderCustomer {
  id: string
  name: string
  image?: string | null
}

export interface RecentOrder {
  id: string
  orderNumber: string
  customer: RecentOrderCustomer
  total: string
  status: string
  paymentStatus?: string
  createdAt: string
}

export interface DashboardOverview {
  sales: SalesSummary
  stock: StockSummary
  orders: OrderSummary
  customers: CustomerSummary
  lowStockProducts: LowStockProduct[]
  recentActivities: RecentActivity[]
  recentOrders: RecentOrder[]
}
