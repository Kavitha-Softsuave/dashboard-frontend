import { IWidget } from "@/types/widget";
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
  widget: IWidget;
  onEdit?: () => void;
  onDelete?: () => void;
  showEditButton?: boolean;
}

// Placeholder data for unconfigured widgets
const placeholderData = [
  { x: "A", y: 30 },
  { x: "B", y: 50 },
  { x: "C", y: 40 },
  { x: "D", y: 60 },
  { x: "E", y: 35 },
];

export const WidgetPreview = ({
  widget,
  onEdit,
  onDelete,
  showEditButton = false,
}: WidgetPreviewProps) => {
  const { config } = widget;

  // Check if widget is configured
  const isConfigured =
    config.data && config.data.length > 0 && config.xAxis && config.yAxis;
  const grayColor = "#9ca3af";

  const renderChart = () => {
    // If not configured, show gray preview
    if (!isConfigured) {
      const commonProps = {
        data: placeholderData,
        margin: { top: 5, right: 5, left: 5, bottom: 5 },
      };

      switch (config.chartType) {
        case "bar":
          return (
            <BarChart {...commonProps}>
              <Bar dataKey="y" fill={grayColor} />
            </BarChart>
          );

        case "line":
          return (
            <LineChart {...commonProps}>
              <Line
                type="monotone"
                dataKey="y"
                stroke={grayColor}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          );

        case "pie":
          return (
            <PieChart>
              <Pie
                data={placeholderData}
                dataKey="y"
                nameKey="x"
                cx="50%"
                cy="50%"
                outerRadius={60}
              >
                {placeholderData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={grayColor} />
                ))}
              </Pie>
            </PieChart>
          );

        case "area":
          return (
            <AreaChart {...commonProps}>
              <Area
                type="monotone"
                dataKey="y"
                stroke={grayColor}
                fill={grayColor}
                fillOpacity={0.3}
              />
            </AreaChart>
          );

        case "scatter":
          return (
            <ScatterChart {...commonProps}>
              <Scatter dataKey="y" fill={grayColor} />
            </ScatterChart>
          );

        default:
          return null;
      }
    }

    // Configured widget - show full chart with axis and primary color
    const filteredData = widget.config?.data.map((d) => ({
      [config.xAxis]: d.xAxis,
      [config.yAxis]: d.yAxis,
    }));

    const baseColor = config.colorPalette?.[0] || "hsl(var(--primary))";

    const commonProps = {
      data: filteredData,
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
    };

    const xAxisProps = {
      dataKey: config.xAxis,
      label: config.xAxisLabel
        ? { value: config.xAxisLabel, position: "insideBottom", offset: -5 }
        : undefined,
    };

    const yAxisProps = {
      dataKey: config.yAxis,
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
            <Bar dataKey={config.yAxis} fill={baseColor} />
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
            <Line type="monotone" dataKey={config.yAxis} stroke={baseColor} />
          </LineChart>
        );

      case "pie":
        return (
          <PieChart>
            <Pie
              data={filteredData}
              dataKey={config.yAxis}
              nameKey={config.xAxis}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {filteredData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    config.colorPalette?.[index % config.colorPalette.length] ||
                    "hsl(var(--primary))"
                  }
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
              dataKey={config.yAxis}
              stroke={baseColor}
              fill={baseColor}
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
            <Scatter dataKey={config.yAxis} fill={baseColor} />
          </ScatterChart>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`h-full w-full flex flex-col bg-card rounded-lg border p-4 ${
        !isConfigured ? "border-dashed border-2 border-gray-300 bg-gray-50" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-lg">{config.title}</h3>
          {config.description && (
            <p className="text-sm text-muted-foreground">
              {config.description}
            </p>
          )}
          {!isConfigured && (
            <p className="text-xs text-gray-400 mt-1">
              Click edit to configure this widget
            </p>
          )}
        </div>
        {showEditButton && onEdit && onDelete && (
          <div className="flex justify-between items-center">
            <button
              onClick={onEdit}
              onMouseDown={(e) => e.stopPropagation()}
              className="text-xs px-3 py-1 text-black hover:text-primary-foreground rounded hover:bg-primary/90"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={onDelete}
              onMouseDown={(e) => e.stopPropagation()}
              className="text-xs px-3 py-1 text-black hover:text-primary-foreground rounded hover:bg-primary/90"
            >
              <Trash2 className="h-5 w-5" />
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
