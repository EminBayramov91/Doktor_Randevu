"use client";

import { useState } from "react";
import { format as formatDate } from "date-fns";
import { az as azLocale } from "date-fns/locale";
import styles from "./calendarToolbar.module.css";
import Image from "next/image";

export default function CalendarToolbar(props) {
    const {
        date,
        onNavigate,
        view,
        onView,
        views,
        services = [],
        serviceFilter = "all",
        onServiceFilterChange,
    } = props;

    const [showViews, setShowViews] = useState(false);
    const [showServices, setShowServices] = useState(false);

    const label = formatDate(date, "d MMMM yyyy", { locale: azLocale });

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
        day: "Gün",
        week: "Həftə",
        month: "Ay",
        agenda: "Siyahı",
    };

    const availableViews = views || ["day", "week", "month", "agenda"];
    const currentViewLabel = viewLabels[view] || view;

    const handleSelectView = (v) => {
        onView && onView(v);
        setShowViews(false);
    };

    let currentServiceLabel = "Bütün xidmətlər";
    if (serviceFilter !== "all") {
        const found = services.find((s) => s.id === serviceFilter);
        currentServiceLabel = found ? found.name : "Seçilmiş xidmət";
    }

    const handleSelectService = (id) => {
        onServiceFilterChange && onServiceFilterChange(id);
        setShowServices(false);
    };

    return (
        <div className={styles.toolbar}>
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

                <div className={styles.datePill}>{label}</div>

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

                <button
                    type="button"
                    className={styles.todayBtn}
                    onClick={handleToday}
                >
                    Bu gün
                </button>
            </div>

            <div className={styles.right}>
                <div className={styles.viewDropdown}>
                    <button
                        type="button"
                        className={styles.viewToggle}
                        onClick={() => {
                            setShowViews((prev) => !prev);
                            setShowServices(false);
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

                <div className={styles.serviceDropdown}>
                    <button
                        type="button"
                        className={styles.viewToggle}
                        onClick={() => {
                            setShowServices((prev) => !prev);
                            setShowViews(false);
                        }}
                    >
                        {currentServiceLabel}
                        <span className={styles.caret}>▾</span>
                    </button>

                    {showServices && (
                        <div className={styles.viewMenu}>
                            <button
                                type="button"
                                className={
                                    serviceFilter === "all"
                                        ? `${styles.viewItem} ${styles.viewItemActive}`
                                        : styles.viewItem
                                }
                                onClick={() => handleSelectService("all")}
                            >
                                Bütün xidmətlər
                            </button>

                            {services.map((s) => (
                                <button
                                    key={s.id}
                                    type="button"
                                    className={
                                        serviceFilter === s.id
                                            ? `${styles.viewItem} ${styles.viewItemActive}`
                                            : styles.viewItem
                                    }
                                    onClick={() => handleSelectService(s.id)}
                                >
                                    {s.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
