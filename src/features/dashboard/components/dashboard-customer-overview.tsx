"use client"

import { Pie, PieChart, ResponsiveContainer } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Skeleton } from "@/components/ui/skeleton"

import type { CustomerSummary } from "../dashboard.types"
import { customerSummary } from "../dashboard.data"

interface DashboardCustomerOverviewProps {
  customers?: CustomerSummary
  isLoading?: boolean
}

const chartConfig = {
  Active: {
    label: "Active",
    color: "var(--chart-1)",
  },
  Inactive: {
    label: "Inactive",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function DashboardCustomerOverview({
  customers,
  isLoading = false,
}: DashboardCustomerOverviewProps) {
  const currentCustomers = customerSummary

  const totalCustomers = currentCustomers.totalCustomers
  const activeCustomers = currentCustomers.activeCustomers

  const inactiveCustomers = Math.max(totalCustomers - activeCustomers, 0)

  const growth = currentCustomers.customerGrowth

  const data = [
    {
      name: "Active",
      value: activeCustomers,
      fill: chartConfig.Active.color,
    },
    {
      name: "Inactive",
      value: inactiveCustomers,
      fill: chartConfig.Inactive.color,
    },
  ]

  return (
    <Card className="min-w-0 gap-3 overflow-hidden">
      <CardHeader className="gap-0 px-3 sm:px-4">
        <CardTitle className="text-sm sm:text-base">
          Customer Overview
        </CardTitle>

        <CardDescription className="text-xs">
          Total Customers: {totalCustomers.toLocaleString("en-BD")}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="relative flex h-60 items-center justify-center">
          {isLoading ? (
            <Skeleton className="size-60 rounded-full" />
          ) : (
            <ChartContainer config={chartConfig} className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="60%"
                    outerRadius="90%"
                  />

                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}

          {/* Center */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-muted-foreground">
              Customer Growth
            </span>

            <span
              className={`text-xl font-semibold tracking-tight sm:text-2xl ${
                growth >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {growth >= 0 ? "+" : ""}
              {growth.toFixed(1)}%
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2 px-3 text-sm sm:px-4">
        <div className="flex items-center gap-2 leading-none font-medium">
          {activeCustomers.toLocaleString("en-BD")} active customers
        </div>

        <div className="leading-none text-muted-foreground">
          {inactiveCustomers.toLocaleString("en-BD")} inactive customers ·{" "}
          {growth >= 0 ? "+" : ""}
          {growth.toFixed(1)}% growth
        </div>
      </CardFooter>
    </Card>
  )
}
