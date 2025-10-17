export type ChartType = "bar" | "line" | "pie" | "area" | "scatter";

export interface ChartConfig {
  xAxis: string;
  yAxis: string;
  chartType: ChartType;
  title: string;
  description?: string;
  showLegend: boolean;
  showGrid: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  colorPalette: string[];
  stringColumns?: string[];
  numericColumns?: string[];
  fileId?: string;
}

export interface Widget {
  id: string;
  config: ChartConfig;
  createdAt: string;
}

export interface DashboardWidget {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Dashboard {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  createdAt: string;
}