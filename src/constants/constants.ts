import {
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  AreaChart as AreaChartIcon,
  ScatterChart as ScatterChartIcon,
  Edit,
  Save,
} from "lucide-react";
import { ChartType } from "@/types/widget";

export const CHART_TYPES: { type: ChartType; icon: any; label: string; color: string }[] = [
  { type: "bar", icon: BarChart3, label: "Bar Chart", color: "hsl(var(--chart-1))" },
  { type: "line", icon: LineChartIcon, label: "Line Chart", color: "hsl(var(--chart-2))" },
  { type: "pie", icon: PieChartIcon, label: "Pie Chart", color: "hsl(var(--chart-3))" },
  { type: "area", icon: AreaChartIcon, label: "Area Chart", color: "hsl(var(--chart-4))" },
  { type: "scatter", icon: ScatterChartIcon, label: "Scatter Chart", color: "hsl(var(--chart-5))" },
];
