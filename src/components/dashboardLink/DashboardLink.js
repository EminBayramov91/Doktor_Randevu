import {usePathname} from "next/navigation";
import styles from "./dashboardLink.module.css";
import Link from "next/link";
import Image from "next/image";

export default function DashboardLink({ href, label, icon }) {
    const pathname = usePathname();
    const isActive = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href)

    return (
        <Link
            href={href}
            className={isActive ? `${styles.link} ${styles.active}` : styles.link}
        >
            <Image
                src={icon}
                alt={label}
                width={18}
                height={18}
            />
            <span>{label}</span>
        </Link>
    )
}