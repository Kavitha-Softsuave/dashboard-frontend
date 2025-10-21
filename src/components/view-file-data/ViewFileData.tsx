import React from "react";
import CustomTable from "../forms/CustomTable";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { useGetFullFileDataQuery } from "@/store/api";
import { Spinner } from "../ui/spinner";
import Loader from "../loader/Loader";

const sampleData = [
  { name: "John Doe", age: 28, country: "USA", role: "Developer" },
  { name: "Alice Smith", age: 32, country: "UK", role: "Designer" },
  { name: "Raj Patel", age: 25, country: "India", role: "Analyst" },
];

function ViewFileData() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);

  const {
    data: fileData,
    isLoading,
    error,
  } = useGetFullFileDataQuery({ id: user.fileId });

  return (
    <div className="flex-1 p-4">
      <div className="flex gap-2 items-center py-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className=" text-xl font-semibold text-foreground">
          {fileData?.data?.fileName}
        </h1>
      </div>
      <div className="relative">
        <CustomTable
          data={fileData?.data?.fileContent}
          caption="Employee Information Table"
          className="h-[calc(100vh-150px)]"
        />
        <Loader isLoading={isLoading} />
      </div>
    </div>
  );
}

export default ViewFileData;
