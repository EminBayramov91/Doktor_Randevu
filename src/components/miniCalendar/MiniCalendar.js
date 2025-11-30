"use client";

import { useState } from "react";
import {
    format as formatDate,
    addMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    isSameDay,
    isSameMonth,
} from "date-fns";
import styles from "./miniCalendar.module.css";

export default function MiniCalendar({ selectedDate, onSelectDate }) {
    const [monthDate, setMonthDate] = useState(selectedDate || new Date());

    const handleMonthPrev = () => {
        setMonthDate((prev) => addMonths(prev, -1));
    };

    const handleMonthNext = () => {
        setMonthDate((prev) => addMonths(prev, 1));
    };

    const handleDayClick = (day) => {
        onSelectDate && onSelectDate(day);
    };

    const renderMonthGrid = () => {
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthStart);
        const start = startOfWeek(monthStart, { weekStartsOn: 1 });
        const end = endOfWeek(monthEnd, { weekStartsOn: 1 });

        const rows = [];
        let current = start;

        while (current <= end) {
            const days = [];

            for (let i = 0; i < 7; i++) {
                const day = current;

                const isCurrentMonth = isSameMonth(day, monthStart);
                const isSelected = isSameDay(day, selectedDate);

                days.push(
                    <button
                        key={day.toISOString()}
                        type="button"
                        className={[
                            styles.day,
                            !isCurrentMonth ? styles.dayOutside : "",
                            isSelected ? styles.daySelected : "",
                        ].join(" ")}
                        onClick={() => handleDayClick(day)}
                    >
                        {formatDate(day, "d")}
                    </button>
                );

                current = addDays(current, 1);
            }

            rows.push(
                <div className={styles.weekRow} key={current.toISOString()}>
                    {days}
                </div>
            );
        }

        return rows;
    };

    return (
        <div className={styles.miniCalendar}>
            <div className={styles.monthHeader}>
                <button
                    type="button"
                    className={styles.monthNav}
                    onClick={handleMonthPrev}
                >
                    ‹
                </button>
                <span className={styles.monthLabel}>
          {formatDate(monthDate, "MMMM yyyy")}
        </span>
                <button
                    type="button"
                    className={styles.monthNav}
                    onClick={handleMonthNext}
                >
                    ›
                </button>
            </div>

            <div className={styles.weekDays}>
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <span key={i} className={styles.weekDay}>
            {d}
          </span>
                ))}
            </div>

            <div className={styles.monthGrid}>{renderMonthGrid()}</div>
        </div>
    );
}
