"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./calendarFilters.module.css";

export default function CalendarFilters({
                                            services = [],
                                            serviceFilter = "all",
                                            onChange,
                                            servicesLoading = false,
                                        }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    let label = "Bütün xidmətlər";
    if (serviceFilter !== "all") {
        const found = services.find(
            (s) => String(s.id) === String(serviceFilter)
        );
        if (found) label = found.name;
    }

    const handleSelect = (id) => {
        if (onChange) onChange(id);
        setOpen(false);
    };

    return (
        <div className={styles.filters} ref={dropdownRef}>
            <button
                type="button"
                className={styles.toggle}
                onClick={() => setOpen((prev) => !prev)}
                disabled={servicesLoading}
            >
                <span className={styles.label}>{label}</span>
                <span className={styles.caret}>▾</span>
            </button>

            {open && (
                <div className={styles.menu}>
                    <button
                        type="button"
                        className={
                            serviceFilter === "all"
                                ? `${styles.item} ${styles.itemActive}`
                                : styles.item
                        }
                        onClick={() => handleSelect("all")}
                    >
                        Bütün xidmətlər
                    </button>

                    {services.map((s) => (
                        <button
                            key={s.id}
                            type="button"
                            className={
                                String(serviceFilter) === String(s.id)
                                    ? `${styles.item} ${styles.itemActive}`
                                    : styles.item
                            }
                            onClick={() => handleSelect(s.id)}
                        >
                            {s.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
