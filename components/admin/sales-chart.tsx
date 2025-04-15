"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface SalesData {
  name: string
  total: number
}

interface SalesChartProps {
  data?: SalesData[]
}

export default function SalesChart({ data = [] }: SalesChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  // Calculate total sales - safely handle empty or undefined data
  const totalSales = Array.isArray(data) 
    ? data.reduce((acc, item) => acc + item.total, 0)
    : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>
          Total Sales: {formatCurrency(totalSales)}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={Array.isArray(data) ? data : []} 
              margin={{ top: 10, right: 25, left: 20, bottom: 20 }}
            >
              <XAxis 
                dataKey="name" 
                tickLine={false} 
                axisLine={false}
                fontSize={12}
                tickMargin={8}
              />
              <YAxis 
                tickFormatter={(value) => `$${value}`}
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tickMargin={8}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(value as number)}
                labelStyle={{ fontSize: 12, fontWeight: 500 }}
              />
              <Bar 
                dataKey="total" 
                fill="#F59E0B" 
                radius={[4, 4, 0, 0]} 
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 