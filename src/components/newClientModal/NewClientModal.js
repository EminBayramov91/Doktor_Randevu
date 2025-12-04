"use client";

import { useState } from "react";
import styles from "./newClientModal.module.css";

export default function NewClientModal({
                                           isOpen,
                                           existingClients = [],
                                           onClose,
                                           onCreate,
                                       }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handlePhoneChange = (e) => {
        let value = e.target.value;
        if (value.startsWith("+")) {
            value = "+" + value.slice(1).replace(/\D/g, "");
        } else {
            value = value.replace(/\D/g, "");
        }
        setPhone(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        const f = firstName.trim();
        const l = lastName.trim();
        const p = phone.trim();

        if (!f || !l) {
            setError("Ad və Soyad mütləqdir.");
            return;
        }

        if (!p) {
            setError("Mobil nömrə mütləqdir.");
            return;
        }

        const exists = existingClients.some((c) => c.phone === p);
        if (exists) {
            setError("Bu nömrə ilə pasiyent artıq mövcuddur.");
            return;
        }

        const client = {
            id: Date.now(),
            firstName: f,
            lastName: l,
            fullName: `${f} ${l}`,
            phone: p,
        };

        onCreate && onCreate(client);
    };

    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Məlumatlar</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.row}>
                        <input
                            type="text"
                            placeholder="Ad"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Soyad"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <div className={styles.row}>
                        <input
                            type="tel"
                            placeholder="Mobil Nömrə"
                            value={phone}
                            onChange={handlePhoneChange}
                        />
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

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
