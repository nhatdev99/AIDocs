export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface ChartData {
  data: ChartDataPoint[];
  xAxis: string;
  yAxis: string;
  type?: 'bar' | 'line' | 'pie' | 'area';
}

export interface ChartProps {
  data: ChartData;
  width?: number;
  height?: number;
}
