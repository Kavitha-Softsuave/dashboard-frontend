import { useState, useEffect } from "react";
import { ChartConfig, ChartType } from "@/types/widget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAppSelector } from "@/store/hooks";
import { ArrowLeftRight } from "lucide-react";

interface WidgetFormProps {
  initialConfig?: ChartConfig;
  onSave: (config: ChartConfig) => void;
  onCancel: () => void;
}
const DEFAULT_COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export const WidgetForm = ({
  initialConfig,
  onSave,
  onCancel,
}: WidgetFormProps) => {
  const [xColumns, setXColumns] = useState<string[]>([
    "Month",
    "Region",
    "Category",
  ]);
  const [yColumns, setYColumns] = useState<string[]>([
    "Sales",
    "Profit",
    "Quantity",
  ]);
  const [config, setConfig] = useState<ChartConfig>(
    initialConfig || {
      xAxis: "",
      yAxis: "",
      chartType: "bar",
      title: "New Chart",
      description: "",
      showLegend: true,
      showGrid: true,
      xAxisLabel: "",
      yAxisLabel: "",
      colorPalette: DEFAULT_COLORS,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      config.title.trim() === "" ||
      config.xAxis.trim() === "" ||
      config.yAxis.trim() === "" ||
      config.chartType.trim() === ""
    ) {
      toast.error("Please fill in all fields");
      return;
    } else if (config.xAxis === config.yAxis) {
      toast.error("X-Axis and Y-Axis cannot be the same");
      return;
    }
    onSave(config);
  };

  const handleSwapAxis = () => {
    const tempX = [...xColumns];
    setXColumns(yColumns);
    setYColumns(tempX);
    setConfig((prev) => ({
      ...prev,
      xAxis: prev.yAxis,
      yAxis: prev.xAxis,
    }));
  };

  const handleSwapColumnLabel = () => {
    setConfig((prev) => ({
      ...prev,
      xAxisLabel: prev.yAxisLabel,
      yAxisLabel: prev.xAxisLabel,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={config.title}
          onChange={(e) => setConfig({ ...config, title: e.target.value })}
          placeholder="Chart Title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Input
          id="description"
          value={config.description || ""}
          onChange={(e) =>
            setConfig({ ...config, description: e.target.value })
          }
          placeholder="Chart description"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="chartType">Chart Type</Label>
        <Select
          value={config.chartType}
          onValueChange={(value: ChartType) =>
            setConfig({ ...config, chartType: value })
          }
        >
          <SelectTrigger id="chartType">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bar">Bar Chart</SelectItem>
            <SelectItem value="line">Line Chart</SelectItem>
            <SelectItem value="pie">Pie Chart</SelectItem>
            <SelectItem value="area">Area Chart</SelectItem>
            <SelectItem value="scatter">Scatter Chart</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className=" gap-4 flex items-end w-full">
        <div className="space-y-2 w-full">
          <Label htmlFor="xAxis">X-Axis</Label>
          {/* <Input
            id="xAxis"
            value={config.xAxis}
            onChange={(e) => setConfig({ ...config, xAxis: e.target.value })}
            placeholder="X-Axis Name"
          /> */}
          <Select
            value={config.xAxis}
            onValueChange={(value: ChartType) => {
              setConfig({ ...config, xAxis: value });
            }}
          >
            <SelectTrigger id="xAxis">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {xColumns?.map((col) => (
                <SelectItem key={col} value={col}>
                  {col}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Button type="button" onClick={() => handleSwapAxis()}>
            <ArrowLeftRight />
          </Button>
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="yAxis">Y-Axis</Label>
          {/* <Input
            id="yAxis"
            value={config.yAxis}
            onChange={(e) => setConfig({ ...config, yAxis: e.target.value })}
            placeholder="Y-Axis Name"
          /> */}
          <Select
            value={config.yAxis}
            onValueChange={(value: ChartType) => {
              setConfig({ ...config, yAxis: value });
            }}
          >
            <SelectTrigger id="yAxis">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {yColumns?.map((col) => (
                <SelectItem key={col} value={col}>
                  {col}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="gap-4 flex items-end w-full">
        <div className="space-y-2 w-full">
          <Label htmlFor="xAxisLabel">X-Axis Label (Optional)</Label>
          <Input
            id="xAxisLabel"
            value={config.xAxisLabel || ""}
            onChange={(e) =>
              setConfig({ ...config, xAxisLabel: e.target.value })
            }
            placeholder="Label"
          />
        </div>
        <div className="space-y-2">
          <Button type="button" onClick={() => handleSwapColumnLabel()}>
            <ArrowLeftRight />
          </Button>
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="yAxisLabel">Y-Axis Label (Optional)</Label>
          <Input
            id="yAxisLabel"
            value={config.yAxisLabel || ""}
            onChange={(e) =>
              setConfig({ ...config, yAxisLabel: e.target.value })
            }
            placeholder="Label"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="showLegend">Show Legend</Label>
        <Switch
          id="showLegend"
          checked={config.showLegend}
          onCheckedChange={(checked) =>
            setConfig({ ...config, showLegend: checked })
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="showGrid">Show Grid</Label>
        <Switch
          id="showGrid"
          checked={config.showGrid}
          onCheckedChange={(checked) =>
            setConfig({ ...config, showGrid: checked })
          }
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          Save Widget
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
