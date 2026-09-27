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
import { TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BarChartData {
  name: string
  value: number
  fill: string
}

interface AppBarChartProps {
  data: BarChartData[]
  config: ChartConfig
  title?: string
  height?: number
  description?: string
  className?: string
  footerTitle?: string
  footerDescription?: string
  isLoading?: boolean
}

export function AppBarChart({
  data,
  config,
  title,
  description,
  height,
  className,
  footerTitle = "Total Visitors",
  footerDescription = "Visitors in the last 30 days",
  isLoading = false,
}: AppBarChartProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}

      <CardContent className="flex flex-1 p-0">
        {isLoading ? (
          <Skeleton className="w-full" />
        ) : (
          <ChartContainer
            config={config}
            className="h-full w-full"
            style={{ height }}
          >
            <BarChart
              accessibilityLayer
              data={data}
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
                  config[value as keyof typeof config]?.label?.toString() ??
                  value
                }
              />

              <YAxis type="number" tickLine={false} axisLine={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="value" radius={6} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {footerTitle}
          <TrendingUp className="h-4 w-4" />
        </div>

        <div className="leading-none text-muted-foreground">
          {footerDescription}
        </div>
      </CardFooter>
    </Card>
  )
}
