"use client";

import styles from "./loginForm.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/store/api/authApi";

export default function LoginForm() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const [doLogin, { isLoading, error }] = useLoginMutation();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const result = await doLogin({ login, password }).unwrap();
            console.log("SimplyBook auth success:", result);

            router.push("/dashboard");
        } catch (err) {
            console.error("SimplyBook auth error:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h3>Login</h3>

            <label>
                <input
                    type="text"
                    placeholder="Login (из SimplyBook)"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    required
                />
            </label>

            <label>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </label>

            <button type="submit" disabled={isLoading}>
                <span>{isLoading ? "Loading..." : "Login"}</span>
            </button>

            {error && (
                <div style={{ color: "red", marginTop: 8 }}>
                    Error. Check your login/password and try again.
                </div>
            )}
        </form>
    );
}
