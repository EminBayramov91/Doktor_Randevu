"use client";

import { useState } from "react";
import { format as formatDate } from "date-fns";
import styles from "./calendarToolbar.module.css";

export default function CalendarToolbar(props) {
    const { date, onNavigate, view, onView, views } = props;
    const [showViews, setShowViews] = useState(false);

    const label = formatDate(date, "EEE dd MMM yyyy");

    const handlePrev = () => {
        onNavigate("PREV");
    };

    const handleNext = () => {
        onNavigate("NEXT");
    };

    const handleToday = () => {
        onNavigate("TODAY");
    };

    const viewLabels = {
        day: "Day",
        week: "Week",
        month: "Month",
        agenda: "Agenda",
    };

    const availableViews = views || ["day", "week", "month", "agenda"];
    const currentViewLabel = viewLabels[view] || view;

    const handleSelectView = (v) => {
        onView && onView(v);
        setShowViews(false);
    };

    return (
        <div className={styles.toolbar}>
            <div className={styles.center}>
                <button
                    type="button"
                    className={styles.arrowBtn}
                    onClick={handlePrev}
                    title={view === "day" ? "Previous day" : "Previous"}
                >
                    ‹
                </button>

                <div className={styles.datePill}>
                    {label}
                </div>

                <button
                    type="button"
                    className={styles.arrowBtn}
                    onClick={handleNext}
                    title={view === "day" ? "Next day" : "Next"}
                >
                    ›
                </button>
            </div>

            <div className={styles.right}>
                <button
                    type="button"
                    className={styles.todayBtn}
                    onClick={handleToday}
                >
                    Today
                </button>

                <div className={styles.viewDropdown}>
                    <button
                        type="button"
                        className={styles.viewToggle}
                        onClick={() => setShowViews((prev) => !prev)}
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
