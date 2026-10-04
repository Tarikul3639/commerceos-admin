"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import { Skeleton } from "@/components/ui/skeleton"

import type { OrderSummary, DashboardQuery } from "../dashboard.types"
import { PERIOD_OPTIONS } from "../dashboard.constants"
import { orderSummary } from "../dashboard.data"

interface DashboardOrderStatusProps {
  orders?: OrderSummary
  query: DashboardQuery
  isLoading?: boolean
}

const orderStatusConfig = {
  value: {
    label: "Orders",
  },
  pending: {
    label: "Pending",
    color: "var(--chart-1)",
  },
  processing: {
    label: "Processing",
    color: "var(--chart-2)",
  },
  shipped: {
    label: "Shipped",
    color: "var(--chart-3)",
  },
  delivered: {
    label: "Delivered",
    color: "var(--chart-4)",
  },
  cancelled: {
    label: "Cancelled",
    color: "var(--destructive)",
  },
} satisfies ChartConfig

export function DashboardOrderStatus({
  orders,
  isLoading = false,
  query,
}: DashboardOrderStatusProps) {
  const currentOrders = orderSummary

  const orderStatusData = [
    {
      name: "delivered",
      value: currentOrders.deliveredOrders,
      fill: orderStatusConfig.delivered.color,
    },
    {
      name: "pending",
      value: currentOrders.pendingOrders,
      fill: orderStatusConfig.pending.color,
    },
    {
      name: "processing",
      value: currentOrders.processingOrders,
      fill: orderStatusConfig.processing.color,
    },
    {
      name: "shipped",
      value: currentOrders.shippedOrders,
      fill: orderStatusConfig.shipped.color,
    },
    {
      name: "cancelled",
      value: currentOrders.cancelledOrders,
      fill: orderStatusConfig.cancelled.color,
    },
  ]

  const periodLabel =
    PERIOD_OPTIONS.find((option) => option.value === query.period)?.label ??
    "selected period"

  return (
    <Card className="min-w-0 gap-3 overflow-hidden">
      <CardHeader className="px-0! sm:px-2!">
        <CardTitle className="text-sm sm:text-base">Order Status</CardTitle>

        <CardDescription className="text-xs">
          Current order distribution
        </CardDescription>
      </CardHeader>

     <CardContent className="px-0! sm:px-2!">
        {isLoading ? (
          <Skeleton className="mx-4 h-56" />
        ) : (
          <ChartContainer config={orderStatusConfig} className="h-60 w-full">
            <BarChart
              accessibilityLayer
              data={orderStatusData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  orderStatusConfig[
                    value as keyof typeof orderStatusConfig
                  ]?.label?.toString() ?? value
                }
              />

              <YAxis type="number" tickLine={false} axisLine={false} />

              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

              <Bar dataKey="value" radius={6} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-2 px-3 text-sm sm:px-4">
        <div className="flex items-center gap-2 leading-none font-medium">
          Total Orders: {currentOrders.totalOrders.toLocaleString("en-BD")}
        </div>

        <div className="leading-none text-muted-foreground">
          Orders in {periodLabel}
        </div>
      </CardFooter>
    </Card>
  )
}
