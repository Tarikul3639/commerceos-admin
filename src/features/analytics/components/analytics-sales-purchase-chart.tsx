"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  LabelList,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
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

import { formatCurrency } from "@/lib/utils/format-currency"

import type { SalesPurchaseChartData } from "../analytics.types"
import { salesPurchaseChartData } from "../analytics.data"
import { useIsMobile } from "@/hooks/use-mobile"

const chartConfig = {
  sales: {
    label: "Sales",
    color: "var(--chart-1)",
  },
  orders: {
    label: "Orders",
    color: "var(--chart-2)",
  },
  purchases: {
    label: "Purchases",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

interface AnalyticsSalesVsPurchaseChartProps {
  data?: SalesPurchaseChartData[]
  isLoading: boolean
  isFetching: boolean
}

export function AnalyticsSalesVsPurchaseChart({
  data,
  isLoading,
  isFetching,
}: AnalyticsSalesVsPurchaseChartProps) {
  // const chartData = data ?? []
  const chartData = salesPurchaseChartData
  const loading = isLoading || isFetching

  const isMobile = useIsMobile()

  return (
    <Card className="min-w-0 overflow-hidden py-0">
      <CardHeader className="px-3 py-3 sm:px-4 sm:py-3.5">
        <CardTitle className="text-sm sm:text-base">
          Sales & Purchase Overview
        </CardTitle>

        <CardDescription className="text-xs sm:text-sm">
          Daily sales, purchases, and order performance
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0 pb-3 sm:pb-4">
        {loading ? (
          <div className="h-[200px] w-full px-3 sm:h-[220px] sm:px-4">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[200px] w-full sm:h-[220px]"
          >
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 10,
                right: 24,
                left: 12,
                bottom: 0,
              }}
            >
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)

                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />

              {!isMobile && (
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                />
              )}

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />

              <Line
                dataKey="sales"
                type="monotone"
                stroke="var(--color-sales)"
                strokeWidth={2}
                activeDot={{ r: 4 }}
              >
                {!isMobile && <LabelList dataKey="orders" position="top" />}
              </Line>

              <Line
                dataKey="purchases"
                type="monotone"
                stroke="var(--color-purchases)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
