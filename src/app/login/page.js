import styles from "./page.module.css";
import LoginForm from "@/components/loginForm/LoginForm";

export default function Page() {
    return (
        <div className={styles.page}>
            <LoginForm/>
        </div>
    );
}