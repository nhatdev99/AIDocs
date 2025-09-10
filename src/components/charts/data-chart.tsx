"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartProps } from '@/types/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface DataChartProps extends Omit<ChartProps, 'width'> {
  title?: string;
  description?: string;
  chartType?: 'bar' | 'line' | 'pie' | 'area';
}

export function DataChart({
  data,
  title,
  description,
  chartType = 'bar',
  height = 400
}: Omit<DataChartProps, 'width'>) {
  // Note: width parameter removed as it's not used in this implementation

  if (!data.data || data.data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title || 'Chart'}</CardTitle>
          <CardDescription>{description || 'No data available for visualization'}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No data available to display
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => {
                  const total = data.data.reduce((sum, item) => sum + (item.value || 0), 0);
                  const numericValue = typeof value === 'number' ? value : 0;
                  const percent = total > 0 ? ((numericValue / total) * 100) : 0;
                  return `${name} ${percent.toFixed(0)}%`;
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || `${data.yAxis} vs ${data.xAxis}`}</CardTitle>
        <CardDescription>
          {description || `Visualization of ${data.yAxis} data`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
}
