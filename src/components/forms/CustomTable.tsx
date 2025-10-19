import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CustomTableProps {
  data: Record<string, any>[];
  caption?: string;
}

const CustomTable: React.FC<CustomTableProps> = ({
  data,
  caption = "Data Overview",
}) => {
  // handle empty data
  if (!data || data.length === 0) {
    return (
      <div className="flex h-40 w-full items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
        No data available
      </div>
    );
  }

  // extract column names dynamically
  const columns = Object.keys(data[0]);

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm relative h-[calc(100vh-150px)] overflow-auto">
      <Table>
        {/* <TableCaption className="text-muted-foreground">{caption}</TableCaption> */}

        {/* Header */}
        <TableHeader>
          <TableRow className="bg-muted/40">
            {columns.map((col) => (
              <TableHead
                key={col}
                className="capitalize text-foreground font-semibold"
              >
                {col.replace(/_/g, " ")}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* Body */}
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              className="hover:bg-muted/20 transition-colors"
            >
              {columns.map((col) => (
                <TableCell key={col} className="text-sm text-muted-foreground">
                  {row[col] ?? "-"}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomTable;
