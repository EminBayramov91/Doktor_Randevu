"use client";

import { useState } from "react";
import styles from "./bookingModal.module.css";
import { format } from "date-fns";

export default function BookingModal({ slot, onClose, onSave }) {
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [service, setService] = useState("Müayinə");
    const [duration, setDuration] = useState(15);

    if (!slot) return null;

    const formattedStart = format(slot.start, "HH:mm");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!fullName.trim() || !phone.trim()) return;

        const start = slot.start;
        const end = new Date(start.getTime() + duration * 60000);

        const newEvent = {
            id: Date.now(),
            title: `${fullName} – ${service}`,
            patientName: fullName,
            phone,
            service,
            start,
            end,
        };

        onSave && onSave(newEvent);
        onClose && onClose();
    };

    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Yeni randevu</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.row}>
                        <label>Pasiyent adı</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Ad Soyad"
                        />
                    </div>

                    <div className={styles.row}>
                        <label>Mobil nömrə</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+994..."
                        />
                    </div>

                    <div className={styles.row}>
                        <label>Xidmət</label>
                        <select
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                        >
                            <option value="Müayinə">Müayinə</option>
                            <option value="USM">USM</option>
                            <option value="Konsultasiya">Konsultasiya</option>
                        </select>
                    </div>

                    <div className={styles.row}>
                        <label>Müddət</label>
                        <select
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                        >
                            <option value={15}>15 dəq</option>
                            <option value={30}>30 dəq</option>
                            <option value={60}>60 dəq</option>
                        </select>
                    </div>

                    <div className={styles.row}>
                        <label>Başlama vaxtı</label>
                        <div className={styles.readonly}>
                            {format(slot.start, "dd.MM.yyyy")} – {formattedStart}
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <button
                            type="button"
                            className={styles.secondaryBtn}
                            onClick={onClose}
                        >
                            Ləğv et
                        </button>
                        <button type="submit" className={styles.primaryBtn}>
                            Yarat
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
