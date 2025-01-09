import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HttpbinResponse } from '../../types';

export const httpbinApi = createApi({
  reducerPath: 'httpbinApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_URL 
  }),
  tagTypes: ['Response'],
  endpoints: (builder) => ({
    getResponses: builder.query<HttpbinResponse[], void>({
      query: () => '/api/responses',
      providesTags: ['Response'],
    }),
    getResponsesByDateRange: builder.query<
      HttpbinResponse[],
      { startDate: string; endDate: string }
    >({
      query: ({ startDate, endDate }) => 
        `/api/responses/range?startDate=${startDate}&endDate=${endDate}`,
      providesTags: ['Response'],
    }),
  }),
});

export const {
  useGetResponsesQuery,
  useGetResponsesByDateRangeQuery,
} = httpbinApi;