"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./calendarToolbar.module.css";
import Image from "next/image";

export default function CalendarToolbar(props) {
    const {
        label,
        date,
        onNavigate,
        view,
        onView,
        views,
    } = props;

    const [showViews, setShowViews] = useState(false);

    const viewDropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            const v = viewDropdownRef.current;

            if (
                v && !v.contains(e.target)
            ) {
                setShowViews(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const viewLabels = {
        day: "Gün",
        week: "Həftə",
        month: "Ay",
        agenda: "Siyahı",
    };

    const availableViews = views || ["day", "week", "month", "agenda"];
    const currentViewLabel = viewLabels[view] || view;

    const handlePrev = () => onNavigate("PREV");
    const handleNext = () => onNavigate("NEXT");
    const handleToday = () => onNavigate("TODAY");

    const handleSelectView = (v) => {
        onView && onView(v);
        setShowViews(false);
    };


    return (
        <div className={styles.toolbar}>
            <button
                type="button"
                className={styles.todayBtn}
                onClick={handleToday}
            >
                Bu gün
            </button>

            <div className={styles.center}>
                <button
                    type="button"
                    className={styles.arrowBtn}
                    onClick={handlePrev}
                    title="Öncəki"
                >
                    <Image
                        src="/arrow-prev.svg"
                        alt="Öncəki"
                        width={15}
                        height={15}
                    />
                </button>

                <button
                    type="button"
                    className={styles.arrowBtn}
                    onClick={handleNext}
                    title="Növbəti"
                >
                    <Image
                        src="/arrow-next.svg"
                        alt="Növbəti"
                        width={15}
                        height={15}
                    />
                </button>

                <div className={styles.datePill}>{label}</div>

            </div>

            <div className={styles.right}>
                <div className={styles.viewDropdown} ref={viewDropdownRef}>
                    <button
                        type="button"
                        className={styles.viewToggle}
                        onClick={() => {
                            setShowViews((prev) => !prev);
                        }}
                    >
                        {currentViewLabel}
                        <span className={styles.caret}>▾</span>
                    </button>

                    {showViews && (
                        <div className={styles.viewMenu}>
                            {availableViews.map((v) => (
                                <button
                                    key={v}
                                    type="button"
                                    className={
                                        view === v
                                            ? `${styles.viewItem} ${styles.viewItemActive}`
                                            : styles.viewItem
                                    }
                                    onClick={() => handleSelectView(v)}
                                >
                                    {viewLabels[v] || v}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
