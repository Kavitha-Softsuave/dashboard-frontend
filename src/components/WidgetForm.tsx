/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { IChartConfig, IChartType } from "@/types/widget";
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
import { ArrowLeftRight } from "lucide-react";
import { useSaveWidgetMutation } from "@/store/api";
import { useAppSelector } from "@/store/hooks";

interface WidgetFormProps {
  initialConfig?: IChartConfig;
  onSave: (config: IChartConfig) => void;
  onCancel: () => void;
  columns?: any;
}

const functionality = ["SUM", "COUNT"];

export const DEFAULT_COLORS = [
  "#8b5cf6",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
];

export const WidgetForm = ({
  initialConfig,
  onSave,
  onCancel,
  columns,
}: WidgetFormProps) => {
  const [xColumns, setXColumns] = useState<string[]>([]);
  const [yColumns, setYColumns] = useState<string[]>([]);
  const user = useAppSelector((state) => state.user);

  const [saveWidget, { isLoading }] = useSaveWidgetMutation();

  const [config, setConfig] = useState<IChartConfig>(
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
      functionality: "SUM",
    }
  );

  useEffect(() => {
    if (columns?.data) {
      setXColumns(columns.data);
      setYColumns(columns.data);
    }
  }, [columns]);

  useEffect(() => {
    if (initialConfig) {
      setConfig((prev) => ({
        ...prev,
        ...initialConfig,
      }));
    }
  }, [initialConfig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      config.title.trim() === "" ||
      config.xAxis.trim() === "" ||
      config.yAxis.trim() === "" ||
      config.chartType.trim() === "" ||
      config.functionality.trim() === ""
    ) {
      toast.error("Please fill in all fields");
      return;
    } else if (config.xAxis === config.yAxis) {
      toast.error("X-Axis and Y-Axis cannot be the same");
      return;
    }

    const payload = {
      xColumn: config.xAxis,
      yColumn: config.yAxis,
      fileId: user?.fileId,
      functionality: config?.functionality,
    };

    try {
      const response = await saveWidget(payload).unwrap();

      toast.success("Widget saved successfully!");

      const updatedConfig = {
        ...config,
        data: response?.data || [],
      };

      // Pass the updated config with data to parent
      onSave(updatedConfig);
      onCancel();
    } catch (error) {
      console.error("Error saving widget:", error);
      toast.error("Failed to save widget");
    }
  };

  const handleSwapAxis = () => {
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
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={config.title}
          onChange={(e) => setConfig({ ...config, title: e.target.value })}
          placeholder="Chart Title"
        />
      </div>

      {/* Description */}
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

      {/* Chart Type */}
      <div className="space-y-2">
        <Label htmlFor="chartType">Chart Type</Label>
        <Select
          value={config.chartType}
          onValueChange={(value: IChartType) =>
            setConfig({ ...config, chartType: value })
          }
        >
          <SelectTrigger id="chartType">
            <SelectValue placeholder="Select Chart Type" />
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

      {/* X & Y Axis */}
      <div className="gap-4 flex items-end w-full">
        {/* X Axis */}
        <div className="space-y-2 w-full">
          <Label htmlFor="xAxis">X-Axis</Label>
          <Select
            key={`xAxis-${config.xAxis}`}
            value={config.xAxis}
            onValueChange={(value: string) =>
              setConfig({ ...config, xAxis: value })
            }
          >
            <SelectTrigger id="xAxis">
              <SelectValue placeholder="Select X-Axis" />
            </SelectTrigger>
            <SelectContent>
              {xColumns.map((col) => (
                <SelectItem key={col} value={col}>
                  {col}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Button type="button" onClick={handleSwapAxis}>
            <ArrowLeftRight />
          </Button>
        </div>

        {/* Y Axis */}
        <div className="space-y-2 w-full">
          <Label htmlFor="yAxis">Y-Axis</Label>
          <Select
            key={`yAxis-${config.yAxis}`}
            value={config.yAxis}
            onValueChange={(value: string) =>
              setConfig({ ...config, yAxis: value })
            }
          >
            <SelectTrigger id="yAxis">
              <SelectValue placeholder="Select Y-Axis" />
            </SelectTrigger>
            <SelectContent>
              {yColumns.map((col) => (
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
          <Label htmlFor="yAxis-functionality">Y-Axis Functionality</Label>
          <Select
            key={`functionality-${config.functionality}`}
            value={config.functionality}
            onValueChange={(value: string) =>
              setConfig({ ...config, functionality: value })
            }
          >
            <SelectTrigger id="yAxis-functionality">
              <SelectValue placeholder="Select functionality" />
            </SelectTrigger>
            <SelectContent>
              {functionality.map((col) => (
                <SelectItem key={col} value={String(col)}>
                  {col}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Axis Labels */}
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
          <Button type="button" onClick={handleSwapColumnLabel}>
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

      {/* Options */}
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

      {/* Buttons */}
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Widget"}
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
