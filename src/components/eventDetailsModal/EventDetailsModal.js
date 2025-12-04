"use client";

import styles from "./eventDetailsModal.module.css";
import { format } from "date-fns";

export default function EventDetailsModal({
                                              event,
                                              onClose,
                                              onCancel,
                                              onEdit,
                                          }) {
    if (!event) return null;

    const startStr = format(event.start, "dd.MM.yyyy HH:mm");
    const endStr = format(event.end, "HH:mm");

    const statusLabel =
        event.status === "cancelled"
            ? "Ləğv edilib"
            : event.type === "block"
                ? "Blok vaxtı"
                : "Aktiv";

    const typeLabel = event.type === "block" ? "Blok vaxtı" : "Randevu";

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
                    <div className={styles.label}>Tip</div>
                    <div className={styles.value}>{typeLabel}</div>
                </div>

                <div className={styles.block}>
                    <div className={styles.label}>Status</div>
                    <div className={styles.value}>{statusLabel}</div>
                </div>

                <div className={styles.block}>
                    <div className={styles.label}>Pasiyent</div>
                    <div className={styles.value}>
                        {event.patientName || "-"}
                    </div>
                </div>

                <div className={styles.block}>
                    <div className={styles.label}>Mobil nömrə</div>
                    <div className={styles.value}>{event.phone || "-"}</div>
                </div>

                <div className={styles.block}>
                    <div className={styles.label}>Xidmət</div>
                    <div className={styles.value}>
                        {event.serviceName || event.service || "-"}
                    </div>
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
                        onClick={() => onEdit && onEdit(event)}
                    >
                        Dəyiş
                    </button>

                    <button
                        type="button"
                        className={styles.dangerBtn}
                        onClick={() => onCancel && onCancel(event.id)}
                    >
                        Ləğv et
                    </button>
                </div>
            </div>
        </div>
    );
}
