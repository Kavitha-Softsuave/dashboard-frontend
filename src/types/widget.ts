export type IChartType = "bar" | "line" | "pie" | "area" | "scatter";

export interface IChartConfig {
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
  functionality: string;
}

export interface IWidget {
  id: string;
  config: IChartConfig;
  createdAt: string;
}

export interface IDashboardWidget {
  i: string; // widget id
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface IDashboard {
  id: string;
  name: string;
  widgets: IDashboardWidget[];
  createdAt: string;
}
