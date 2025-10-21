import { useGetFullFileDataQuery, useGetWidgetColumnsQuery } from "@/store/api";
import React from "react";
import CustomTable from "../forms/CustomTable";
import { WidgetForm } from "../WidgetForm";
import { useAppSelector } from "@/store/hooks";
import { IChartConfig } from "@/types/widget";

interface DashboardWidgetPanelProps {
  initialConfig?: IChartConfig;
  onSave: (config: IChartConfig) => void;
  onCancel: () => void;
}

function DashboardWidgetPanel({
  initialConfig,
  onSave,
  onCancel,
}: DashboardWidgetPanelProps) {
  const user = useAppSelector((state) => state.user);
  const hasFileId = Boolean(user?.fileId?.length);

  const {
    data: columnsData,
    isLoading: getWidgetColumnLoading,
    error: getWidgetColumnError,
  } = useGetWidgetColumnsQuery({ id: user.fileId }, { skip: !hasFileId });

  const {
    data: fileData,
    isLoading: getWidgetDataLoading,
    error: getWidgetDataError,
  } = useGetFullFileDataQuery({ id: user.fileId }, { skip: !hasFileId });

  return (
    <div>
      {" "}
      {getWidgetColumnLoading && getWidgetDataLoading ? (
        <div className="flex items-center justify-center p-6">
          <p className="text-muted-foreground">Loading columns...</p>
        </div>
      ) : getWidgetColumnError ? (
        <div className="flex items-center justify-center p-6">
          <p className="text-destructive">Error loading columns data</p>
        </div>
      ) : !hasFileId ? (
        <div className="flex items-center justify-center p-6">
          <p className="text-destructive">File is not uploaded</p>
        </div>
      ) : (
        <div className="w-full flex">
          <div className="flex-1 p-4 ">
            <h1 className="mb-3 text-xl font-semibold text-foreground">
              {fileData?.data?.fileName}
            </h1>
            <CustomTable
              data={fileData?.data?.fileContent}
              caption="Employee Information Table"
            />
          </div>
          <WidgetForm
            initialConfig={initialConfig}
            onSave={onSave}
            onCancel={onCancel}
            columns={columnsData}
          />
        </div>
      )}
    </div>
  );
}

export default DashboardWidgetPanel;
