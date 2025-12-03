"use client"

import {
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  Label,
} from "recharts"

import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card"
import { ChartContainer } from "@/app/components/ui/chart"

export function ChartRadialShape({ items = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item: { value: number; color: string; title: string }, index: number) => {
        const chartData = [
          { visitors: item.value, fill: item.color },
        ]

        return (
          <Card key={index} className="flex flex-col">
            <CardHeader className="items-center pb-0">
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={{}}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <RadialBarChart
                  data={chartData}
                  endAngle={100}
                  innerRadius={80}
                  outerRadius={140}
                >
                  <PolarGrid
                    gridType="circle"
                    radialLines={false}
                    stroke="none"
                    className="first:fill-muted last:fill-background"
                    polarRadius={[86, 74]}
                  />

                  <RadialBar dataKey="visitors" background />

                  <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-4xl font-bold"
                              >
                                {item.value}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                                {item.title}
                              </tspan>
                            </text>
                          )
                        }
                      }}
                    />
                  </PolarRadiusAxis>
                </RadialBarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
