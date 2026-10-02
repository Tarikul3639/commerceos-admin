export interface AnalyticsQuery {
  startDate?: string
  endDate?: string
  period?: "7d" | "30d" | "3m" | "6m" | "1y"
}

export interface PurchaseSummary {
  totalPurchases: string
  todayPurchases: string
  totalPurchaseOrders: number
  pendingPurchases: number
  purchaseGrowth: number
}

export interface RevenueChartData {
  date: string
  revenue: string
}

export interface SalesPurchaseChartData {
  date: string
  sales: string
  purchases: string
  orders: number
}

export interface TopProduct {
  productId: string
  productName: string
  productImage?: string | null
  sku?: string
  totalSold: number
  totalRevenue: string
}

export interface TopCustomer {
  customerId: string
  customerName: string
  customerImage?: string | null
  email?: string
  phone?: string
  totalOrders: number
  totalSpent: string
}
