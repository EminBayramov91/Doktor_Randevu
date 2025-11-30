"use client"
import Sidebar from "@/components/sidebar/Sidebar";
import {useSelector} from "react-redux";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function DashboardLayout({children}) {
    const user = useSelector(state => state.auth.user);
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.replace("/login");
        }
    }, [user, router]);

    if (!user) return null;

    return (
        <div style={{ display: "flex" }}>
            <Sidebar />
            <main>
                {children}
            </main>
        </div>
    );
}