import styles from "./sidebar.module.css";
import DashboardLink from "@/components/dashboardLink/DashboardLink";
import Image from "next/image";
import {useState} from "react";


const links = [
    { href: "/dashboard", label: "Dashboard", icon: "/dashboardIcon.svg", },
    { href: "/dashboard/calendar", label: "Calendar", icon: "/calendarIcon.svg",},
    { href: "/dashboard/clients", label: "Müştəri siyahısı", icon: "/clientsIcon.svg",},
    { href: "/dashboard/profile", label: "Profil", icon: "/profileIcon.svg",},
]


export default function Sidebar() {
    const [isActive, setIsActive] = useState(true);
    const menuHandler = () => {
        setIsActive(prev => !prev)
    }

    return (
        <aside className={`${styles.sidebar} ${isActive ? styles.activeSidebar : ""}`}>
            <div>
                <div className={`${styles.menu} ${isActive ? styles.activeMenu : ""}`} onClick={menuHandler}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <nav>
                    {links.map(link => (
                        <DashboardLink key={link.href} href={link.href} label={link.label} icon={link.icon}/>
                    ))}
                </nav>
            </div>
            <button className={`${styles.button} ${isActive ? styles.activeButton : ""}`}>
                <Image
                    src="/exitIcon.svg"
                    alt="Exit icon"
                    width={18}
                    height={18}
                />
                <span>Çıxış</span>
            </button>
        </aside>
    )
}