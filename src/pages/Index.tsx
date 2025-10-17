/* eslint-disable react-hooks/rules-of-hooks */
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { WidgetPreview } from "@/components/WidgetPreview";
import { useResizeObserver } from "@/hooks/use-resize";
import { useRef } from "react";

const Index = () => {
  const navigate = useNavigate();
  const dashboards = useAppSelector((state) => state.dashboards.dashboards);
  const widgets = useAppSelector((state) => state.widgets.widgets);

  // Get latest saved dashboard
  const latestDashboard =
    dashboards.length > 0 ? dashboards[dashboards.length - 1] : null;

  // If no dashboards exist
  if (!latestDashboard) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
        <div className="flex gap-4 mb-8">
          <Button size="lg" onClick={() => navigate("/widgets")}>
            Manage Widgets
          </Button>
          <Button size="lg" onClick={() => navigate("/dashboard")}>
            Build Dashboard
          </Button>
          <Button size="lg" onClick={() => navigate("/upload")}>
            Upload Files
          </Button>
        </div>
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-2">No dashboards found</p>
          <p className="text-sm text-muted-foreground">
            Create a new dashboard to see it here
          </p>
        </Card>
      </div>
    );
  }

  // Map dashboard widgets with actual widget config
  const dashboardWidgets = latestDashboard.widgets
    .map((dw) => ({
      dashboardWidget: dw,
      widget: widgets.find((w) => w.id === dw.i),
    }))
    .filter((item) => item.widget !== undefined);

  // Observe dashboard container width dynamically
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth = 1200 } = useResizeObserver({
    ref: containerRef,
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Buttons */}
      <div className="flex gap-4 p-4 border-b bg-card justify-center">
        <Button size="lg" onClick={() => navigate("/widgets")}>
          Manage Widgets
        </Button>
        <Button size="lg" onClick={() => navigate("/dashboard")}>
          Build Dashboard
        </Button>
        <Button size="lg" onClick={() => navigate("/upload")}>
          Upload Files
        </Button>
      </div>

      {/* Dashboard Preview */}
      <div
        ref={containerRef}
        className="flex-1 p-6 bg-muted/20"
      >
        <GridLayout
          className="layout"
          layout={latestDashboard.widgets.map((item) => ({
            ...item,
            minW: 4,
            minH: 4,
          }))}
          cols={12}
          rowHeight={100}
          width={containerWidth}
          isDraggable={false}
          isResizable={false}
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
                showEditButton={false}
              />
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  );
};

export default Index;
