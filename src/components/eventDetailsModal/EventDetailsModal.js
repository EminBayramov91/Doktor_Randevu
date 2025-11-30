"use client";

import styles from "./eventDetailsModal.module.css";
import { format } from "date-fns";

export default function EventDetailsModal({ event, onClose, onDelete }) {
    if (!event) return null;

    const startStr = format(event.start, "dd.MM.yyyy HH:mm");
    const endStr = format(event.end, "HH:mm");

    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Randevu detalları</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className={styles.block}>
                    <div className={styles.label}>Pasiyent</div>
                    <div className={styles.value}>{event.patientName || "-"}</div>
                </div>

                <div className={styles.block}>
                    <div className={styles.label}>Mobil nömrə</div>
                    <div className={styles.value}>{event.phone || "-"}</div>
                </div>

                <div className={styles.block}>
                    <div className={styles.label}>Xidmət</div>
                    <div className={styles.value}>{event.service || "-"}</div>
                </div>

                <div className={styles.block}>
                    <div className={styles.label}>Vaxt</div>
                    <div className={styles.value}>
                        {startStr} – {endStr}
                    </div>
                </div>

                <div className={styles.footer}>
                    <button
                        type="button"
                        className={styles.secondaryBtn}
                        onClick={onClose}
                    >
                        Bağla
                    </button>

                    <button
                        type="button"
                        className={styles.primaryBtn}
                        onClick={() => onDelete && onDelete(event.id)}
                    >
                        Sil
                    </button>

                    <button type="button" className={styles.disabledBtn} disabled>
                        Edit (soon)
                    </button>
                </div>
            </div>
        </div>
    );
}
