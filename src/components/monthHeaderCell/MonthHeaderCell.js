"use client";

import styles from "./monthHeaderCell.module.css";

export default function MonthHeaderCell({ date, localizer }) {
    const weekday = localizer
        .format(date, "EEE")
        .toUpperCase();

    return (
        <div className={styles.header}>
            {weekday}
        </div>
    );
}
