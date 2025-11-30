"use client";

import { useState } from "react";
import styles from "./calendarPageClient.module.css";
import CalendarSidebar from "@/components/calendarSidebar/CalendarSidebar";
import CalendarWrapper from "@/components/calendarWrapper/CalendarWrapper";

export default function CalendarPageClient() {
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState("day");

    const handleSelectDateFromMini = (day) => {
        setDate(day);
        setView("day");
    };

    const handleNavigate = (newDate) => {
        setDate(newDate);
    };

    const handleViewChange = (newView) => {
        setView(newView);
    };

    return (
        <div className={styles.wrapper}>
            <CalendarSidebar
                selectedDate={date}
                onSelectDate={handleSelectDateFromMini}
            />
            <CalendarWrapper
                date={date}
                view={view}
                onDateChange={handleNavigate}
                onViewChange={handleViewChange}
            />
        </div>
    );
}
