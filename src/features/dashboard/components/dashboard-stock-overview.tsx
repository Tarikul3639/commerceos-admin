"use client"

import {
  Archive,
  Boxes,
  CircleDollarSign,
  Layers3,
  Package,
} from "lucide-react"

import { Pie, PieChart, ResponsiveContainer } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

import type { StockSummary } from "../dashboard.types"
import { stockSummary } from "../dashboard.data"

interface DashboardStockOverviewProps {
  stock?: StockSummary
  isLoading?: boolean
}

const stockStatusConfig = {
  healthy: {
    label: "Healthy",
    color: "var(--chart-1)",
  },
  lowStock: {
    label: "Low Stock",
    color: "var(--chart-2)",
  },
  outOfStock: {
    label: "Out of Stock",
    color: "var(--destructive)",
  },
} satisfies ChartConfig

export function DashboardStockOverview({
  stock,
  isLoading = false,
}: DashboardStockOverviewProps) {
  const currentStock = stockSummary

  const healthyCount = Math.max(
    currentStock.totalProducts -
      currentStock.lowStockCount -
      currentStock.outOfStockCount,
    0
  )

  const stockStatusData = [
    {
      name: "healthy",
      value: healthyCount,
    },
    {
      name: "lowStock",
      value: currentStock.lowStockCount,
    },
    {
      name: "outOfStock",
      value: currentStock.outOfStockCount,
    },
  ]

  const chartData = stockStatusData.map((item) => {
    const config =
      stockStatusConfig[item.name as keyof typeof stockStatusConfig]

    return {
      name: config.label,
      value: item.value,
      fill: config.color,
    }
  })

  return (
    <Card className="min-w-0 gap-3 overflow-hidden">
      <CardHeader className="gap-0 px-3 sm:px-4">
        <CardTitle>Stock Overview</CardTitle>
        <CardDescription>Overview of product stock status</CardDescription>
      </CardHeader>

      <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="grid items-center lg:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)]">
          {/* Chart */}
          <div className="relative flex h-60 min-w-0 items-center justify-center">
            {isLoading ? (
              <Skeleton className="size-60 rounded-full" />
            ) : (
              <ChartContainer
                config={stockStatusConfig}
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="60%"
                      outerRadius="95%"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}

            {/* Center Content */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold">
                {currentStock.totalProducts.toLocaleString("en-BD")}
              </p>

              <p className="text-xs text-muted-foreground">Total Products</p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden h-full bg-border lg:block" />

          {/* Summary */}
          <div className="flex min-w-0 items-center px-0 pt-6 lg:px-6 lg:pt-0">
            <div className="w-full space-y-3">
              <StockItem
                icon={Boxes}
                label="Products"
                description="Total products"
                value={currentStock.totalProducts.toLocaleString("en-BD")}
              />

              <StockItem
                icon={Layers3}
                label="Variants"
                description="Product variants"
                value={currentStock.totalVariants.toLocaleString("en-BD")}
              />

              <StockItem
                icon={Package}
                label="Stock Qty"
                description="Available units"
                value={currentStock.totalStockQuantity.toLocaleString("en-BD")}
              />

              <StockItem
                icon={CircleDollarSign}
                label="Stock Value"
                description="Current inventory value"
                value={`৳${Number(currentStock.totalStockValue).toLocaleString(
                  "en-BD"
                )}`}
              />

              <StockItem
                icon={Archive}
                label="Low Stock"
                description="Products below threshold"
                value={currentStock.lowStockCount.toLocaleString("en-BD")}
              />

              <StockItem
                icon={Package}
                label="Out of Stock"
                description="Products unavailable"
                value={currentStock.outOfStockCount.toLocaleString("en-BD")}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface StockItemProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  description: string
  value: string
}

interface StockItemProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  description: string
  value: string
}

function StockItem({ icon: Icon, label, description, value }: StockItemProps) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-6">
      <div className="flex min-w-0 items-center gap-2">
        <Icon className="size-3.5 shrink-0 text-muted-foreground" />

        <div className="min-w-0">
          <p className="truncate text-xs font-medium">{label}</p>

          <p className="truncate text-[11px] text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <span className="text-xs font-medium tabular-nums">{value}</span>
    </div>
  )
}
