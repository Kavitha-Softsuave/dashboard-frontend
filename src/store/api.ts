/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the response type based on your API structure
export interface ColumnData {
  xColumns: string[];
  yColumns: string[];
}

// Define payload type for saving the widget
export interface SaveWidgetPayload {
  xColumn: string;
  yColumn: string;
}

export const widgetApi = createApi({
  reducerPath: "widgetApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://tkt8nkkb-5000.inc1.devtunnels.ms/api/",
  }),
  tagTypes: ["Widget"], // ✅ Add this to fix invalidatesTags related issue

  endpoints: (builder) => ({
    getWidgetColumns: builder.query<ColumnData, void>({
      query: () => "get-columns",
      providesTags: ["Widget"], // ✅ Optional but recommended
    }),

    saveWidget: builder.mutation<any, SaveWidgetPayload>({
      query: (body) => ({
        url: "get-data-by-columns",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Widget"], // ✅ Tells RTK Query to re-fetch columns if needed
    }),
  }),
});

export const { useGetWidgetColumnsQuery, useSaveWidgetMutation } = widgetApi;
