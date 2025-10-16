import { Widget } from "@/types/widget";
import { Edit, Trash2 } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface WidgetPreviewProps {
  widget: Widget;
  onEdit?: () => void;
  onDelete?: () => void;
  showEditButton?: boolean;
}

const SAMPLE_DATA = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
];

export const WidgetPreview = ({
  widget,
  onEdit,
  onDelete,
  showEditButton = false,
}: WidgetPreviewProps) => {
  const { config } = widget;

  const renderChart = () => {
    const commonProps = {
      data: SAMPLE_DATA,
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
    };

    const xAxisProps = {
      dataKey: "name",
      label: config.xAxisLabel
        ? { value: config.xAxisLabel, position: "insideBottom", offset: -5 }
        : undefined,
    };

    const yAxisProps = {
      label: config.yAxisLabel
        ? { value: config.yAxisLabel, angle: -90, position: "insideLeft" }
        : undefined,
    };

    switch (config.chartType) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip />
            {config.showLegend && <Legend />}
            <Bar dataKey="value" fill={config.colorPalette[0]} />
          </BarChart>
        );

      case "line":
        return (
          <LineChart {...commonProps}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip />
            {config.showLegend && <Legend />}
            <Line
              type="monotone"
              dataKey="value"
              stroke={config.colorPalette[0]}
            />
          </LineChart>
        );

      case "pie":
        return (
          <PieChart>
            <Pie
              data={SAMPLE_DATA}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {SAMPLE_DATA.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={config.colorPalette[index % config.colorPalette.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            {config.showLegend && <Legend />}
          </PieChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip />
            {config.showLegend && <Legend />}
            <Area
              type="monotone"
              dataKey="value"
              stroke={config.colorPalette[0]}
              fill={config.colorPalette[0]}
            />
          </AreaChart>
        );

      case "scatter":
        return (
          <ScatterChart {...commonProps}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip />
            {config.showLegend && <Legend />}
            <Scatter dataKey="value" fill={config.colorPalette[0]} />
          </ScatterChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-card rounded-lg border p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-lg">{config.title}</h3>
          {config.subtitle && (
            <p className="text-sm text-muted-foreground">{config.subtitle}</p>
          )}
        </div>
        {showEditButton && onEdit && onDelete && (
          <div className="flex justify-between items-center">
            <button
              onClick={onEdit}
              onMouseDown={(e) => e.stopPropagation()}
              className="text-xs px-3 py-1 text-black hover:text-primary-foreground rounded hover:bg-primary/90"
            >
              <Edit className="h-5 w-5"/>
            </button>
            <button
              onClick={onDelete}
              onMouseDown={(e) => e.stopPropagation()}
              className="text-xs px-3 py-1 text-black hover:text-primary-foreground rounded hover:bg-primary/90"
            >
              <Trash2 className="h-5 w-5"/>
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
