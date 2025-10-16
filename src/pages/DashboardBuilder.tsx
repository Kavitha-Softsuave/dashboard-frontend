import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setCurrentDashboard,
  updateDashboardLayout,
  saveDashboard,
  addWidgetToDashboard,
  removeWidgetFromDashboard,
} from "@/store/dashboardSlice";
import { Dashboard, DashboardWidget } from "@/types/widget";
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
import { ArrowLeft, Plus, Save } from "lucide-react";
import { toast } from "sonner";
import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const DashboardBuilder = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const widgets = useAppSelector((state) => state.widgets.widgets);
  const currentDashboard = useAppSelector(
    (state) => state.dashboards.currentDashboard
  );
  const [isWidgetListOpen, setIsWidgetListOpen] = useState(true);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null);
  const [draggedWidgetId, setDraggedWidgetId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentDashboard) {
      const newDashboard: Dashboard = {
        id: Date.now().toString(),
        name: "New Dashboard",
        widgets: [],
        createdAt: new Date().toISOString(),
      };
      dispatch(setCurrentDashboard(newDashboard));
    }
  }, [currentDashboard, dispatch]);

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

  const handleAddWidget = (widgetId: string) => {
    if (!currentDashboard) return;

    const existsInDashboard = currentDashboard.widgets.some(
      (w) => w.i === widgetId
    );
    if (existsInDashboard) {
      toast.error("Widget already exists in dashboard");
      return;
    }

    const { x, y } = calculateNextPosition();
    const newDashboardWidget: DashboardWidget = {
      i: widgetId,
      x,
      y,
      w: 4,
      h: 3,
    };

    dispatch(addWidgetToDashboard(newDashboardWidget));
    toast.success("Widget added to dashboard");
  };

  const handleLayoutChange = (layout: Layout[]) => {
    if (!currentDashboard) return;

    const updatedWidgets: DashboardWidget[] = layout.map((item) => ({
      i: item.i,
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
    }));

    dispatch(updateDashboardLayout(updatedWidgets));
  };

  const handleSaveDashboard = () => {
    dispatch(saveDashboard());
    toast.success("Dashboard saved successfully");
  };

  const handleEditWidget = (widgetId: string) => {
    setEditingWidgetId(widgetId);
    setIsEditSheetOpen(true);
  };

  const handleDeleteWidget = (widgetId: string) => {
    if (!currentDashboard) return;

    // Dispatch action to remove widget from current dashboard
    dispatch(removeWidgetFromDashboard(widgetId));

    // If the widget being edited was deleted, close the edit sheet and clear the editing id
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
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Dashboard Builder</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsWidgetListOpen(!isWidgetListOpen)}
            >
              {isWidgetListOpen ? "Hide" : "Show"} Widgets
            </Button>
            <Button onClick={handleSaveDashboard}>
              <Save className="mr-2 h-4 w-4" />
              Save Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Widget List Sidebar */}
        {isWidgetListOpen && (
          <div className="w-80 border-r bg-card p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Available Widgets</h2>
            {widgets.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No widgets available
              </p>
            ) : (
              <div className="space-y-3">
                {widgets.map((widget) => (
                  <Card
                    key={widget.id}
                    className="p-3 cursor-move hover:border-primary transition-colors"
                    draggable
                    onDragStart={() => handleDragStart(widget.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm">
                        {widget.config.title}
                      </h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAddWidget(widget.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {widget.config.chartType.charAt(0).toUpperCase() +
                        widget.config.chartType.slice(1)}{" "}
                      Chart
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Dashboard Canvas */}
        <div
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
              layout={currentDashboard.widgets}
              cols={12}
              rowHeight={60}
              width={1200}
              onLayoutChange={handleLayoutChange}
              isDraggable={true}
              isResizable={true}
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
                    onEdit={() => handleEditWidget(widget!.id)}
                    onDelete={() => handleDeleteWidget(widget!.id)}
                    showEditButton={true}
                  />
                </div>
              ))}
            </GridLayout>
          )}
        </div>
      </div>

      {/* Edit Widget Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Widget Configuration</SheetTitle>
          </SheetHeader>
          {editingWidgetId && (
            <WidgetForm
              initialConfig={
                widgets.find((w) => w.id === editingWidgetId)?.config
              }
              onSave={(config) => {
                // Handle widget config update
                setIsEditSheetOpen(false);
                setEditingWidgetId(null);
                toast.success("Widget configuration updated");
              }}
              onCancel={() => {
                setIsEditSheetOpen(false);
                setEditingWidgetId(null);
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default DashboardBuilder;
