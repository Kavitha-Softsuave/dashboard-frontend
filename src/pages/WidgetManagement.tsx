/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addWidget, updateWidget, deleteWidget } from "@/store/widgetSlice";
import { IWidget } from "@/types/widget";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { WidgetForm } from "@/components/WidgetForm";
import { WidgetPreview } from "@/components/WidgetPreview";
import { Card } from "@/components/ui/card";
import { Edit, Trash2, Plus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useGetWidgetColumnsQuery } from "@/store/api";
import {
  FullSheet,
  FullSheetContent,
  FullSheetHeader,
  FullSheetTitle,
} from "@/components/ui/full-sheet";
import CustomTable from "@/components/forms/CustomTable";

const sampleData = [
  { name: "John Doe", age: 28, country: "USA", role: "Developer" },
  { name: "Alice Smith", age: 32, country: "UK", role: "Designer" },
  { name: "Raj Patel", age: 25, country: "India", role: "Analyst" },
];
const WidgetManagement = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const widgets = useAppSelector((state) => state.widgets.widgets);
  const user = useAppSelector((state) => state.user);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingWidget, setEditingWidget] = useState<IWidget | null>(null);

  const {
    data: columnsData,
    isLoading,
    error,
  } = useGetWidgetColumnsQuery({ id: user?.fileId });

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
    setIsSheetOpen(false);
    setEditingWidget(null);
  };

  const handleEdit = (widget: IWidget) => {
    setEditingWidget(widget);
    setIsSheetOpen(true);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteWidget(id));
    toast.success("Widget deleted successfully");
  };

  const handleAddNew = () => {
    setEditingWidget(null);
    setIsSheetOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="">
        <div className="flex items-center justify-between text-white bg-[#614b75] p-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Widget Management</h1>
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add Widget
          </Button>
        </div>

        {widgets.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No widgets created yet</p>
            <Button onClick={handleAddNew}>Create Your First Widget</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-3">
            {widgets.map((widget) => (
              <Card key={widget.id} className="p-4">
                <div className="h-64 mb-4">
                  <WidgetPreview widget={widget} />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(widget)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDelete(widget.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editingWidget ? "Edit Widget" : "Create Widget"}
            </SheetTitle>
          </SheetHeader>
          <WidgetForm
            initialConfig={editingWidget?.config}
            onSave={handleSaveWidget}
            onCancel={() => {
              setIsSheetOpen(false);
              setEditingWidget(null);
            }}
            columns={columnsData}
          />
        </SheetContent>
      </Sheet> */}
      <FullSheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <FullSheetContent
          side="right"
          className="w-full sm:max-w-full overflow-y-auto"
        >
          <FullSheetHeader>
            <FullSheetTitle>
              {editingWidget ? "Edit Widget" : "Create Widget"}
            </FullSheetTitle>
          </FullSheetHeader>
          <div className="w-full flex">
            <div className="flex-1 p-4 ">
              <h1 className="mb-3 text-xl font-semibold text-foreground">
                Employee Information Table
              </h1>
              <CustomTable
                data={sampleData}
                caption="Employee Information Table"
              />
            </div>
            <WidgetForm
              initialConfig={editingWidget?.config}
              onSave={handleSaveWidget}
              onCancel={() => {
                setIsSheetOpen(false);
                setEditingWidget(null);
              }}
              columns={columnsData}
            />
          </div>
        </FullSheetContent>
      </FullSheet>
    </div>
  );
};

export default WidgetManagement;
