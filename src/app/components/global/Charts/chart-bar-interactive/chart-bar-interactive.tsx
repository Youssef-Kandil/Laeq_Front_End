/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/components/ui/chart"

export const description = "An interactive bar chart"

const chartData = [
  { date: "2024-04-01", Pending: 222, in_progres: 150,Completed:100 },
  { date: "2024-04-02", Pending: 97, in_progres: 180,Completed:2},
  { date: "2024-04-03", Pending: 97, in_progres: 180,Completed:20},
  { date: "2024-04-04", Pending: 97, in_progres: 180,Completed:20},
  { date: "2024-04-05", Pending: 97, in_progres: 180,Completed:20},
]


export function ChartBarInteractive({data=chartData}) {
  const [activeChart, setActiveChart] =
  React.useState<string>("Pending");
  // React.useState<keyof typeof chartConfig>("Pending");
  const chartConfig = {
    views: {
      label: `Total ${activeChart} Tasks`,
    },
    Pending: {
      label: "Pending",
      color: "var(--chart-2)",
    },
    in_progres: {
      label: "Progress",
      color: "var(--chart-1)",
    },
    Completed: {
      label: "Completed",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig

  const total = React.useMemo(
    () => ({
      Pending: data.reduce((acc, curr) => acc + curr.Pending, 0),
      in_progres: data.reduce((acc, curr) => acc + curr.in_progres, 0),
      Completed: data.reduce((acc, curr) => acc + curr.Completed, 0),
      // draft: data.reduce((acc, curr) => acc + curr.in_progres, 0),
    }),
    [data]
  )

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>Tasks Chart </CardTitle>
          <CardDescription>
            Showing total tasks for this month
          </CardDescription>
        </div>
        <div className="flex">
          {["Pending", "in_progres","Completed"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
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
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value:any) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
