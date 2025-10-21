/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the response type based on your API structure
export interface ColumnData {
  data: { fileContent: any; fileName: string };
}

// Define payload type for saving the widget
export interface SaveWidgetPayload {
  xColumn: string;
  yColumn: string;
  fileId: string;
}

export const widgetApi = createApi({
  reducerPath: "widgetApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/",
  }),
  tagTypes: ["wig"],

  endpoints: (builder) => ({
    getWidgetColumns: builder.query<ColumnData, { id: string }>({
      query: (data) => ({
        url: `get-columns?fileId=${data?.id}`,
        method: "GET",
      }),
      providesTags: ["wig"],
    }),

    getFullFileData: builder.query<ColumnData, { id: string }>({
      query: (data) => ({
        url: `get-file-data?fileId=${data?.id}`,
        method: "GET",
      }),
      providesTags: ["wig"],
    }),

    saveWidget: builder.mutation<any, SaveWidgetPayload>({
      query: (body) => ({
        url: "get-data-by-columns",
        method: "POST",
        body,
      }),
    }),

    uploadFile: builder.mutation<any, FormData>({
      query: (body) => ({
        url: "upload-csv",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetWidgetColumnsQuery,
  useGetFullFileDataQuery,
  useSaveWidgetMutation,
  useUploadFileMutation,
} = widgetApi;
