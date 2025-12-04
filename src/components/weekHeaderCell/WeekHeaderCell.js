"use client";

import { isSameDay } from "date-fns";
import styles from "./weekHeaderCell.module.css";

export default function WeekHeaderCell(props) {
    const { date, localizer, selectedDate, onSelectDate } = props;

    const weekday = localizer
        .format(date, "EEE")
        .toUpperCase();

    const dayNum = localizer.format(date, "d");

    const isSelected = selectedDate && isSameDay(date, selectedDate);

    const handleClick = () => {
        if (onSelectDate) onSelectDate(date);
    };

    return (
        <button
            type="button"
            className={`${styles.cell} ${isSelected ? styles.selected : ""}`}
            onClick={handleClick}
        >
            <div className={styles.weekday}>{weekday}</div>
            <div className={styles.dayNum}>
                <span>{dayNum}</span>
            </div>
        </button>
    );
}
