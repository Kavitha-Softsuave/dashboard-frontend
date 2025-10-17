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
  {
    Sales: 5000,
    Profit: 1200,
    Quantity: 50,
    Month: "Jan",
    Region: "North",
    Category: "Electronics",
  },
  {
    Sales: 7000,
    Profit: 2000,
    Quantity: 70,
    Month: "Feb",
    Region: "South",
    Category: "Clothing",
  },
  {
    Sales: 6500,
    Profit: 1500,
    Quantity: 60,
    Month: "Mar",
    Region: "East",
    Category: "Furniture",
  },
  {
    Sales: 8000,
    Profit: 2500,
    Quantity: 80,
    Month: "Apr",
    Region: "West",
    Category: "Electronics",
  },
  {
    Sales: 7200,
    Profit: 1800,
    Quantity: 65,
    Month: "May",
    Region: "North",
    Category: "Clothing",
  },
  {
    Sales: 6000,
    Profit: 1300,
    Quantity: 55,
    Month: "Jun",
    Region: "South",
    Category: "Furniture",
  },
  {
    Sales: 9000,
    Profit: 3000,
    Quantity: 90,
    Month: "Jul",
    Region: "East",
    Category: "Electronics",
  },
  {
    Sales: 7500,
    Profit: 2200,
    Quantity: 75,
    Month: "Aug",
    Region: "West",
    Category: "Clothing",
  },
  {
    Sales: 6800,
    Profit: 1600,
    Quantity: 60,
    Month: "Sep",
    Region: "North",
    Category: "Furniture",
  },
  {
    Sales: 8200,
    Profit: 2400,
    Quantity: 85,
    Month: "Oct",
    Region: "South",
    Category: "Electronics",
  },
];
export const WidgetPreview = ({
  widget,
  onEdit,
  onDelete,
  showEditButton = false,
}: WidgetPreviewProps) => {
  const { config } = widget;

  const renderChart = () => {
    const filteredData = SAMPLE_DATA.map((d) => {
      return {
        [config.xAxis]: d[config.xAxis],
        [config.yAxis]: d[config.yAxis],
      };
    });

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
            <Bar dataKey={config.yAxis} fill={config.colorPalette[0]} />
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
              dataKey={config.yAxis}
              stroke={config.colorPalette[0]}
            />
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
              {filteredData.map((entry, index) => (
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
              dataKey={config.yAxis}
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
            <Scatter dataKey={config.yAxis} fill={config.colorPalette[0]} />
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
          {config.description && (
            <p className="text-sm text-muted-foreground">
              {config.description}
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
