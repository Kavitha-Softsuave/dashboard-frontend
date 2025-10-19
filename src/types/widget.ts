export type ChartType = "bar" | "line" | "pie" | "area" | "scatter";

export interface ChartConfig {
  xAxis: string;
  yAxis: string;
  chartType: string;
  title: string;
  description?: string;
  showLegend: boolean;
  showGrid: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  colorPalette: string[];
  dataSeriesSettings?: any;
  tooltipSettings?: any;
  data?: any;
  type?: string;
}

export interface Widget {
  id: string;
  config: ChartConfig;
  createdAt: string;
}

export interface DashboardWidget {
  i: string; // widget id
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
