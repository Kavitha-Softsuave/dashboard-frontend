/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { ArrowLeftRight } from "lucide-react";
import Papa from "papaparse";
import { useUploadCsvMutation } from "@/store/slices/apiSlice";

interface WidgetFormProps {
  initialConfig?: ChartConfig;
  onSave: (config: ChartConfig, parsedData?: Record<string, string>[]) => void;
  onCancel: () => void;
  isEditMode?: boolean;
}

const DEFAULT_COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export const WidgetForm = ({
  initialConfig,
  onSave,
  onCancel,
  isEditMode,
}: WidgetFormProps) => {
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
      stringColumns: [],
      numericColumns: [],
    }
  );

  const [parsedData, setParsedData] = useState<Record<string, string>[]>([]);
  const [stringColumns, setStringColumns] = useState<string[]>([]);
  const [numericColumns, setNumericColumns] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string | null>(
    initialConfig?.fileId || null
  );

  // Load existing columns when editing
  useEffect(() => {
    if (initialConfig?.stringColumns && initialConfig?.numericColumns) {
      setStringColumns(initialConfig.stringColumns);
      setNumericColumns(initialConfig.numericColumns);
    }
  }, [initialConfig]);
  const [uploadCsv, { isLoading }] = useUploadCsvMutation();


  // Detect column types
  const detectColumnTypes = (data: Record<string, string>[]) => {
    if (!data || data.length === 0) return;

    const sample = data.slice(0, 10);
    const columnNames = Object.keys(sample[0]);

    const stringCols: string[] = [];
    const numericCols: string[] = [];

    columnNames.forEach((col) => {
      const values = sample.map((row) => row[col]);
      const isNumeric = values.every(
        (val) => val !== "" && !isNaN(Number(val))
      );
      if (isNumeric) numericCols.push(col);
      else stringCols.push(col);
    });

    setStringColumns(stringCols);
    setNumericColumns(numericCols);

    // Store columns in config
    setConfig((prev) => ({
      ...prev,
      stringColumns: stringCols,
      numericColumns: numericCols,
    }));
  };

  // Handle CSV Upload
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      toast.error("Please upload a CSV file only.");
      return;
    }

    setSelectedFile(file);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as Record<string, string>[];
        if (rows && rows.length > 0) {
          setParsedData(rows);
          detectColumnTypes(rows);
          toast.success("CSV uploaded and parsed successfully!");
        } else {
          toast.error("Failed to parse CSV.");
        }
      },
      error: () => toast.error("Error reading CSV file."),
    });
  };

  // Swap axis values and column types
  const handleSwapAxis = () => {
    setConfig((prev) => {
      const newConfig = {
        ...prev,
        xAxis: prev.yAxis,
        yAxis: prev.xAxis,
        stringColumns: prev.numericColumns || [],
        numericColumns: prev.stringColumns || [],
      };
      return newConfig;
    });

    // Also swap the local state column arrays
    const tempString = [...stringColumns];
    const tempNumeric = [...numericColumns];
    setStringColumns(tempNumeric);
    setNumericColumns(tempString);
  };

  // Swap label values
  // Swap label values
  const handleSwapColumnLabel = () => {
    setConfig((prev) => ({
      ...prev,
      xAxisLabel: prev.yAxisLabel,
      yAxisLabel: prev.xAxisLabel,
    }));
  };

  // Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      config.title.trim() === "" ||
      config.xAxis.trim() === "" ||
      config.yAxis.trim() === "" ||
      config.chartType.trim() === ""
    ) {
      toast.error("Please fill in all required fields");
      return;
    } else if (config.xAxis === config.yAxis) {
      toast.error("X-Axis and Y-Axis cannot be the same");
      return;
    }
    onSave(config, parsedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      {/* CSV Upload */}
      <div className="space-y-2">
        <Label htmlFor="csvUpload">Upload CSV</Label>
        <Input
          type="file"
          id="csvUpload"
          accept=".csv"
          onChange={handleCsvUpload}
        />
      </div>

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

      {/* Chart Type */}
      <div className="space-y-2">
        <Label htmlFor="chartType">Chart Type</Label>
        <Select
          value={config.chartType}
          onValueChange={(value: ChartType) =>
            setConfig({ ...config, chartType: value })
          }
        >
          <SelectTrigger id="chartType">
            <SelectValue placeholder="Select chart type" />
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

      {/* Axis Selection */}
      <div className="gap-4 flex items-end w-full">
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
              {stringColumns.map((col) => (
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
              {numericColumns.map((col) => (
                <SelectItem key={col} value={col}>
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

      {/* Toggles */}
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
          {isEditMode ? "Update Widget" : "Save Widget"}
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
