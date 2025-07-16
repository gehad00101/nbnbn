"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const data = [
  { month: "يناير", sales: 18600 },
  { month: "فبراير", sales: 30500 },
  { month: "مارس", sales: 23700 },
  { month: "أبريل", sales: 7300 },
  { month: "مايو", sales: 20900 },
  { month: "يونيو", sales: 21400 },
]

const chartConfig = {
  sales: {
    label: "المبيعات",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function SalesChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} dir="rtl">
          <XAxis
            dataKey="month"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value / 1000} ألف`}
            orientation="right"
          />
          <Tooltip 
            cursor={{fill: 'hsl(var(--muted))'}}
            content={<ChartTooltipContent />} 
          />
          <Bar dataKey="sales" fill="var(--color-sales)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
