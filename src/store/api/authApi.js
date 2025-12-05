import { baseApi } from "./baseApi";
import { loginSuccess } from "../authSlice";
import { env } from "@/config/env";

export const authApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation({
            query: ({ login, password }) => ({
                url: "/admin/auth",
                method: "POST",
                body: {
                    company: env.companyLogin,
                    login,
                    password,
                },
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    console.log("SimplyBook /admin/auth result:", data);

                    dispatch(
                        loginSuccess({
                            user: {
                                login: data.login,
                                company: data.company,
                            },
                            token: data.token,
                            refreshToken: data.refresh_token || null,
                        }),
                    );
                } catch (err) {
                    console.error("SimplyBook /admin/auth error:", err);
                }
            },
        }),
    }),
    overrideExisting: false,
});

export const { useLoginMutation } = authApi;
