import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { env } from "@/config/env";

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: env.apiUrl,
        prepareHeaders: (headers, { getState }) => {
            const state = getState();
            const token = state.auth?.token;

            if (env.companyLogin) {
                headers.set("X-Company-Login", env.companyLogin);
            }

            if (token) {
                headers.set("X-Token", token);
            }

            headers.set("Content-Type", "application/json");
            return headers;
        },
    }),
    endpoints: () => ({}),
});
