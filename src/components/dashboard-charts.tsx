'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';

const monthlyRevenue = [
  { month: 'Jan', revenue: 1860 },
  { month: 'Feb', revenue: 3050 },
  { month: 'Mar', revenue: 2370 },
  { month: 'Apr', revenue: 730 },
  { month: 'May', revenue: 2090 },
  { month: 'Jun', revenue: 2140 },
  { month: 'Jul', revenue: 3450 },
  { month: 'Aug', revenue: 2890 },
  { month: 'Sep', revenue: 1980 },
  { month: 'Oct', revenue: 3210 },
  { month: 'Nov', revenue: 3500 },
  { month: 'Dec', revenue: 4100 },
];

const dueDatesSummary = [
    { status: 'Overdue', count: 5 },
    { status: 'Due Today', count: 8 },
    { status: 'Due This Week', count: 12 },
    { status: 'Due Next Week', count: 20 },
];

export function DashboardCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ChartContainer config={{}} className="h-[350px] w-full">
            <ResponsiveContainer>
              <BarChart data={monthlyRevenue}>
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
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="col-span-4 lg:col-span-3">
        <CardHeader>
          <CardTitle>Due Dates Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-[350px] w-full">
            <ResponsiveContainer>
               <BarChart data={dueDatesSummary} layout="vertical">
                <XAxis type="number" hide />
                <YAxis
                  dataKey="status"
                  type="category"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                 <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
