"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
import { useIsMobile } from "@/hooks/use-mobile"

import type { RevenueChartData } from "../analytics.types"
import { revenueChartData } from "../analytics.data"

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function AnalyticsRevenue({
  revenue,
  isLoading,
}: {
  revenue?: RevenueChartData[]
  isLoading: boolean
}) {
  const revenueData = revenueChartData

  const isMobile = useIsMobile()

  const data = revenueData.map((item) => ({
    date: item.date,
    revenue: Number(item.revenue),
  }))

  return (
    <Card className="min-w-0 overflow-hidden py-0">
      <CardHeader className="px-3 py-3 sm:px-4 sm:py-3.5">
        <CardTitle className="text-sm sm:text-base">Revenue Overview</CardTitle>

        <CardDescription className="text-xs sm:text-sm">
          Daily revenue performance
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0 pb-3 sm:pb-4">
        {isLoading ? (
          <div className="h-[200px] w-full px-3 sm:h-[220px] sm:px-4">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[200px] w-full sm:h-[220px]"
          >
            <BarChart
              accessibilityLayer
              data={data}
              margin={{
                top: 10,
                right: 10,
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
                  tickFormatter={(value) =>
                    formatCurrency(value, { compact: true })
                  }
                />
              )}

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    formatter={(value) =>
                      formatCurrency(Number(value), { compact: false })
                    }
                  />
                }
              />

              <Bar
                dataKey="revenue"
                fill="var(--color-revenue)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
