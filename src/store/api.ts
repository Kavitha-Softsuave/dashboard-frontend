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
  tagTypes: ["wig"],

  endpoints: (builder) => ({
    getWidgetColumns: builder.query<ColumnData, void>({
      query: () => ({
        url: "get-columns",
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
      invalidatesTags: ["wig"],
    }),
  }),
});

export const { useGetWidgetColumnsQuery, useSaveWidgetMutation } = widgetApi;
