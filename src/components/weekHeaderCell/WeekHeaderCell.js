"use client";

import { isSameDay } from "date-fns";
import styles from "./weekHeaderCell.module.css";

export default function WeekHeaderCell(props) {
    const { date, localizer, selectedDate, onSelectDate, onDrillDown } = props;

    const weekday = localizer.format(date, "EEE").toUpperCase();
    const dayNum = localizer.format(date, "d");
    const isSelected = selectedDate && isSameDay(date, selectedDate);

    const handleClick = () => {
        if (onSelectDate) onSelectDate(date);
        if (onDrillDown) onDrillDown(date);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
        }
    };

    return (
        <div
            role="button"
            tabIndex={0}
            className={`${styles.cell} ${isSelected ? styles.selected : ""}`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
        >
            <div className={styles.weekday}>{weekday}</div>
            <div className={styles.dayNum}>
                <span>{dayNum}</span>
            </div>
        </div>
    );
}
