/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGetWidgetColumnsQuery } from "@/store/api";
import {
  setCurrentDashboard,
  updateDashboardLayout,
  saveDashboard,
  addWidgetToDashboard,
  removeWidgetFromDashboard,
} from "@/store/dashboardSlice";
import { IDashboard, IDashboardWidget, IWidget } from "@/types/widget";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { WidgetPreview } from "@/components/WidgetPreview";
import { WidgetForm } from "@/components/WidgetForm";
import { ArrowLeft, Menu, Plus, Save, X } from "lucide-react";
import { toast } from "sonner";
import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { addWidget, updateWidget } from "@/store/widgetSlice";
import { useResizeObserver } from "@/hooks/use-resize";
import { Toggle } from "@/components/ui/toggle";
import { Switch } from "@/components/ui/switch";
import { CHART_TYPES } from "@/constants/constants";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import UploadForm from "@/components/forms/UploadForm";
import CustomTable from "@/components/forms/CustomTable";
import DashboardWidgetPanel from "@/components/dashboard-widget-panal/DashboardWidgetPanal";

const sampleData = [
  { name: "John Doe", age: 28, country: "USA", role: "Developer" },
  { name: "Alice Smith", age: 32, country: "UK", role: "Designer" },
  { name: "Raj Patel", age: 25, country: "India", role: "Analyst" },
];

const DashboardBuilder = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const widgets = useAppSelector((state) => state.widgets.widgets);
  const user = useAppSelector((state) => state.user);
  const currentDashboard = useAppSelector(
    (state) => state.dashboards.currentDashboard
  );
  const [isWidgetListOpen, setIsWidgetListOpen] = useState(true);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isEditDashboard, setIsEditDashboard] = useState(false);
  const [editingWidget, setEditingWidget] = useState<IWidget | null>(null);
  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null);
  const [draggedWidgetId, setDraggedWidgetId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (!currentDashboard) {
      const newDashboard: IDashboard = {
        id: Date.now().toString(),
        name: "New Dashboard",
        widgets: [],
        createdAt: new Date().toISOString(),
      };
      dispatch(setCurrentDashboard(newDashboard));
    }
  }, [currentDashboard, dispatch]);

  const dashboardRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth = 1200 } = useResizeObserver({
    ref: dashboardRef,
  });

  const calculateNextPosition = (): { x: number; y: number } => {
    if (!currentDashboard || currentDashboard.widgets.length === 0) {
      return { x: 0, y: 0 };
    }

    const layout = currentDashboard.widgets;
    const cols = 12;
    const defaultWidth = 4;

    // Find the lowest available position
    let maxY = 0;
    layout.forEach((item) => {
      const bottomY = item.y + item.h;
      if (bottomY > maxY) maxY = bottomY;
    });

    // Try to place in the current row first
    for (let y = 0; y <= maxY; y++) {
      for (let x = 0; x <= cols - defaultWidth; x++) {
        const hasCollision = layout.some((item) => {
          return !(
            x + defaultWidth <= item.x ||
            x >= item.x + item.w ||
            y + 3 <= item.y ||
            y >= item.y + item.h
          );
        });

        if (!hasCollision) {
          return { x, y };
        }
      }
    }

    // If no space found, add to new row
    return { x: 0, y: maxY };
  };

  const [widgetCounter, setWidgetCounter] = useState(0);

  const handleAddWidget = (chartType: string) => {
    if (!currentDashboard) return;

    const newId = `${chartType}-${widgetCounter}`;
    setWidgetCounter((prev) => prev + 1);

    const { x, y } = calculateNextPosition();
    const newDashboardWidget: IDashboardWidget = {
      i: newId,
      x,
      y,
      w: 4,
      h: 4,
    };

    const newWidget: IWidget = {
      id: newId,
      config: {
        title: `${chartType} Widget ${widgetCounter + 1}`,
        type: chartType,
        data: [],
        xAxis: "",
        yAxis: "",
        chartType: chartType,
        showLegend: false,
        showGrid: false,
        colorPalette: [],
      },
      createdAt: new Date().toISOString(),
    };

    dispatch(addWidget(newWidget));
    dispatch(addWidgetToDashboard(newDashboardWidget));
    toast.success(`${chartType} widget added`);
  };

  const handleLayoutChange = (layout: Layout[]) => {
    if (!currentDashboard) return;

    const updatedWidgets: IDashboardWidget[] = layout.map((item) => ({
      i: item.i,
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
    }));

    dispatch(updateDashboardLayout(updatedWidgets));
  };

  const handleSaveWidget = (config: any) => {
    if (editingWidget) {
      dispatch(updateWidget({ ...editingWidget, config }));
      toast.success("Widget updated successfully");
    } else {
      const duplicateWidget = widgets.find(
        (w) => w.config.title === config.title
      );
      if (duplicateWidget) {
        toast.error("A widget with this title already exists");
        return;
      }
      const newWidget: IWidget = {
        id: Date.now().toString(),
        config,
        createdAt: new Date().toISOString(),
      };
      dispatch(addWidget(newWidget));
      toast.success("Widget created successfully");
    }
    setIsEditSheetOpen(false);
    setEditingWidget(null);
  };

  const handleSaveDashboard = () => {
    dispatch(saveDashboard());
    toast.success("Dashboard saved successfully");
    setIsWidgetListOpen(false);
    setIsEditDashboard(false);
  };

  const handleEditWidget = (widget: IWidget) => {
    setEditingWidgetId(widget.id);
    setEditingWidget(widget);
    setIsEditSheetOpen(true);
    setIsEditMode(true);
  };

  const handleAddNew = () => {
    setEditingWidget(null);
    setIsEditMode(false);
    setIsEditSheetOpen(true);
  };

  const handleDeleteWidget = (widgetId: string) => {
    if (!currentDashboard) return;

    dispatch(removeWidgetFromDashboard(widgetId));

    if (editingWidgetId === widgetId) {
      setIsEditSheetOpen(false);
      setEditingWidgetId(null);
    }

    toast.success("Widget removed from dashboard");
  };

  const handleDragStart = (widgetId: string) => {
    setDraggedWidgetId(widgetId);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedWidgetId) {
      handleAddWidget(draggedWidgetId);
      setDraggedWidgetId(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (!currentDashboard) return null;

  const dashboardWidgets = currentDashboard.widgets
    .map((dw) => ({
      dashboardWidget: dw,
      widget: widgets.find((w) => w.id === dw.i),
    }))
    .filter((item) => item.widget !== undefined);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="flex items-center justify-between p-4 min-h-[72px]">
          <div className="flex items-center gap-4">
            <h1
              className={`text-2xl font-bold transition-all duration-300 ${
                isEditDashboard && !isWidgetListOpen ? "ml-11" : "ml-0"
              }`}
            >
              Dashboard
            </h1>{" "}
          </div>
          <div className="flex gap-2 items-center">
            {isEditDashboard && (
              <>
                {/* <Button
                  variant="outline"
                  onClick={() => setIsWidgetListOpen(!isWidgetListOpen)}
                >
                  Add Widgets
                </Button> */}
                <Button onClick={handleSaveDashboard}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => navigate("/view-file")}>
              View Data
            </Button>
            <div className="flex items-center gap-1">
              Edit
              <Switch
                checked={isEditDashboard}
                onCheckedChange={(checked: boolean) => {
                  setIsEditDashboard(checked);
                  setIsWidgetListOpen(checked);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Widget List Sidebar */}

        {isEditDashboard && !isWidgetListOpen && (
          <button
            onClick={() => setIsWidgetListOpen(true)}
            className="fixed top-4 left-4 z-50 p-2 bg-card border rounded-lg shadow-md hover:bg-accent transition-all"
          >
            <Menu className="h-5 w-5 text-foreground" />
          </button>
        )}
        {isWidgetListOpen && isEditDashboard && (
          <div className="w-80 border-r bg-card pt-4 overflow-y-auto flex flex-col">
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold mb-4 pl-3">Base Widgets</h2>
              <X
                className="cursor-pointer mr-2"
                onClick={() => setIsWidgetListOpen(false)}
              />
            </div>
            <div className="flex flex-col justify-between h-full overflow-hidden">
              <div className="">
                <div className="space-y-3 px-2 overflow-auto custom-scrollbar h-[calc(100vh-200px)] ">
                  <div className="space-y-3">
                    {CHART_TYPES.map((chartType) => {
                      const IconComponent = chartType.icon;
                      return (
                        <Card
                          key={chartType.type}
                          draggable
                          onDragStart={() => handleDragStart(chartType.type)}
                          className="p-4 cursor-move hover:bg-accent/50 transition-all border-2 hover:border-primary/50 hover:shadow-md"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 rounded-lg bg-primary/10">
                                <IconComponent className="h-7 w-7 text-primary" />
                              </div>
                              <span className="font-semibold text-foreground">
                                {chartType.label}
                              </span>
                            </div>

                            <button
                              onClick={() => handleAddWidget(chartType.type)}
                              className="p-2 hover:bg-primary/10 rounded-full transition"
                            >
                              <Plus className="h-5 w-5 text-primary" />
                            </button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
                x
              </div>
              {/* <div className="flex justify-center items-center gap-1 mb-3">
                <Button onClick={handleAddNew} disabled={isLoading}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Widget
                </Button>
                <Button onClick={() => navigate("/widgets")}>
                  Manage Widgets
                </Button>
              </div> */}
            </div>
          </div>
        )}

        {/* Dashboard Canvas */}
        <div
          ref={dashboardRef}
          className="flex-1 p-6 overflow-auto bg-muted/20"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {dashboardWidgets.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-2">Dashboard is empty</p>
                <p className="text-sm text-muted-foreground">
                  Add widgets by clicking the + button or drag and drop from the
                  sidebar
                </p>
              </Card>
            </div>
          ) : (
            <GridLayout
              className="layout"
              layout={currentDashboard.widgets.map((item) => ({
                ...item,
                minW: 4,
                minH: 4,
              }))}
              cols={12}
              rowHeight={70}
              width={containerWidth}
              onLayoutChange={handleLayoutChange}
              isDraggable={isEditDashboard}
              isResizable={isEditDashboard}
              compactType="vertical"
              preventCollision={false}
            >
              {dashboardWidgets.map(({ dashboardWidget, widget }) => (
                <div
                  key={dashboardWidget.i}
                  className="bg-background rounded-lg shadow-sm"
                >
                  <WidgetPreview
                    widget={widget!}
                    onEdit={() => handleEditWidget(widget)}
                    onDelete={() => handleDeleteWidget(widget!.id)}
                    showEditButton={isEditDashboard}
                  />
                </div>
              ))}
            </GridLayout>
          )}
        </div>
      </div>

      {/* Edit Widget Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="w-full sm:max-w-full overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {isEditMode ? "Edit Widget Configuration" : "Create New Widget"}
            </SheetTitle>
          </SheetHeader>
          <DashboardWidgetPanel
            initialConfig={
              widgets.find((w) => w.id === editingWidgetId)?.config ||
              editingWidget?.config
            }
            onSave={handleSaveWidget}
            onCancel={() => {
              setIsEditSheetOpen(false);
              setEditingWidgetId(null);
            }}
          />
        </SheetContent>
      </Sheet>
      <Dialog open={!user?.fileId?.length}>
        <DialogContent hideCloseButton={true}>
          <DialogTitle>Upload file for dashboard creation</DialogTitle>
          <UploadForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardBuilder;
