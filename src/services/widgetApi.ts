// src/services/widgetApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the response type based on your API structure
export interface WidgetDataResponse {
  columns: {
    xAxis: string[];
    yAxis: string[];
  };
}

export const widgetApi = createApi({
  reducerPath: 'widgetApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://tkt8nkkb-5000.inc1.devtunnels.ms/api/',
  }),
  endpoints: (builder) => ({
    getWidgetColumns: builder.query<WidgetDataResponse, void>({
      query: () => 'get-columns',
    }),
  }),
});

export const { useGetWidgetColumnsQuery } = widgetApi;