/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface UploadCsvResponse {
  success: boolean;
  data: Record<string, any>[];
  columns: {
    stringColumns: string[];
    numericColumns: string[];
  };
  message?: string;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://tkt8nkkb-5000.inc1.devtunnels.ms/api' 
  }),
  endpoints: (builder) => ({
    uploadCsv: builder.mutation<UploadCsvResponse, FormData>({
      query: (formData) => ({
        url: '/upload-csv',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useUploadCsvMutation } = apiSlice;