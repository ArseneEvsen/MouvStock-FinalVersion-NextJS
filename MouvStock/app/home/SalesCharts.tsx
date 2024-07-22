// File: components/ProductChart.tsx

"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Sale {
  productId: string;
  quantity: number;
  date: string;
  price: number;
}

interface ProductChartProps {
  period: string;
  sales: Sale[];
}

const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const monthsOfYear = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

const formatSalesData = (sales: Sale[], period: string) => {
  const correctDayNames = (day: string) => {
    const daysMap: { [key: string]: string } = {
      'Monday': 'Lundi',
      'Tuesday': 'Mardi',
      'Wednesday': 'Mercredi',
      'Thursday': 'Jeudi',
      'Friday': 'Vendredi',
      'Saturday': 'Samedi',
      'Sunday': 'Dimanche',
      'lundi': 'Lundi',
      'mardi': 'Mardi',
      'mercredi': 'Mercredi',
      'jeudi': 'Jeudi',
      'vendredi': 'Vendredi',
      'samedi': 'Samedi',
      'dimanche': 'Dimanche'
    };
    return daysMap[day] || day;
  };

  if (period === 'weekly') {
    const weeklyData: { [key: string]: number } = {
      'Lundi': 0,
      'Mardi': 0,
      'Mercredi': 0,
      'Jeudi': 0,
      'Vendredi': 0,
      'Samedi': 0,
      'Dimanche': 0
    };

    sales.forEach(sale => {
      const date = new Date(sale.date);
      const day = correctDayNames(date.toLocaleString('fr-FR', { weekday: 'long' }));
      const profit = sale.quantity * sale.price;
      weeklyData[day] += profit;
    });

    return daysOfWeek.map(day => ({ day, profit: weeklyData[day] }));
  } else if (period === 'annual') {
    const annualData: { [key: string]: number } = {
      'Janvier': 0,
      'Février': 0,
      'Mars': 0,
      'Avril': 0,
      'Mai': 0,
      'Juin': 0,
      'Juillet': 0,
      'Août': 0,
      'Septembre': 0,
      'Octobre': 0,
      'Novembre': 0,
      'Décembre': 0
    };

    sales.forEach(sale => {
      const date = new Date(sale.date);
      const month = monthsOfYear[date.getMonth()];
      const profit = sale.quantity * sale.price;
      annualData[month] += profit;
    });

    return monthsOfYear.map(month => ({ month, profit: annualData[month] }));
  }
  return [];
};

export function SalesCharts({ period, sales }: ProductChartProps) {
  const data = formatSalesData(sales, period);

  const chartConfig: ChartConfig = {
    profit: {
      label: "Profit",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Graphique des Profits</CardTitle>
        <CardDescription>
          {period === 'weekly' ? "Profits Hebdomadaires" : "Profits Annuels"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart width={600} height={300} data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={period === 'weekly' ? 'day' : 'month'}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="profit" fill="#1e90ff" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
