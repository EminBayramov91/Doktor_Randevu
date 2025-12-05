import { baseApi } from "./baseApi";

export const simplybookApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getServices: build.query({
            query: () => ({
                url: "/admin/services",
                method: "GET",
            }),
        }),
    }),
    overrideExisting: false,
});

export const { useGetServicesQuery } = simplybookApi;
