"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
import { cn } from "@/lib/utils"

export interface AreaChartData {
  [key: string]: string | number
}

interface AppAreaChartProps {
  data: AreaChartData[]
  config: ChartConfig

  /** X-axis data key */
  xAxisKey: string

  /** Area data keys */
  dataKeys: string[]

  /** Card title */
  title?: string

  /** Card description */
  description?: string

  /** Chart height */
  height?: number

  /** Show grid */
  showGrid?: boolean

  /** Show tooltip */
  showTooltip?: boolean

  /** X-axis formatter */
  xAxisFormatter?: (value: string) => string

  /** Y-axis formatter */
  yAxisFormatter?: (value: number) => string

  /** Tooltip value formatter */
  tooltipFormatter?: (value: number) => string

  /** Loading state */
  isLoading?: boolean

  className?: string
  chartContainerClassName?: string
}

export function AppAreaChart({
  data,
  config,
  xAxisKey,
  dataKeys,
  title,
  description,
  height = 250,
  showGrid = true,
  showTooltip = true,
  xAxisFormatter,
  yAxisFormatter,
  tooltipFormatter,
  isLoading = false,
  className,
  chartContainerClassName,
}: AppAreaChartProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}

      <CardContent className="p-0">
        {isLoading ? (
          <div
            className={cn("w-full p-6", chartContainerClassName)}
            style={{ height }}
          >
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <ChartContainer
            config={config}
            className={cn("aspect-auto w-full", chartContainerClassName)}
            style={{ height }}
          >
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{
                top: 10,
                left: 5,
                right: 5,
              }}
            >
              {showGrid && <CartesianGrid vertical={false} />}

              <XAxis
                dataKey={xAxisKey}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={xAxisFormatter}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={yAxisFormatter}
              />

              {showTooltip && (
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="dot"
                      formatter={
                        tooltipFormatter
                          ? (value) => tooltipFormatter(Number(value))
                          : undefined
                      }
                    />
                  }
                />
              )}

              {dataKeys.map((key) => (
                <Area
                  key={key}
                  dataKey={key}
                  type="monotone"
                  fill={`var(--color-${key})`}
                  fillOpacity={0.2}
                  stroke={`var(--color-${key})`}
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
