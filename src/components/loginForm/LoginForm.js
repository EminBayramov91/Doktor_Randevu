"use client"
import styles from "./loginForm.module.css";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {useRouter} from "next/navigation";
import {loginSuccess} from "@/store/authSlice";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const router = useRouter();

    const handleSubmit = (event) => {
        event.preventDefault();

        const fakeUser = {
            id: "1",
            name: "Dr. " + (email || "Test"),
            email: email || "test@doctor.az",
        };

        dispatch(
            loginSuccess({
                user: fakeUser,
                token: "FAKE_TOKEN",
            })
        );

        router.push("/dashboard");
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h3>Login</h3>

            <label>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
            </label>

            <label>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
            </label>


            <button type="submit">
                <span>Login</span>
            </button>
        </form>
    )
}