"use client";

import { useEffect, useState } from "react";
import styles from "./patientModal.module.css";

export default function PatientModal({
                                         mode = "create",
                                         initialPatient = null,
                                         existingPatients = [],
                                         onClose,
                                         onSave,
                                     }) {
    const isEdit = mode === "edit";
    const [fullName, setFullName] = useState(initialPatient?.fullName || "");
    const [phone, setPhone] = useState(initialPatient?.phone || "");
    const [email, setEmail] = useState(initialPatient?.email || "");
    const [birthDate, setBirthDate] = useState(initialPatient?.birthDate || "");
    const [notes, setNotes] = useState(initialPatient?.notes || "");

    const [error, setError] = useState("");

    useEffect(() => {
        setError("");
    }, [fullName, phone, email, birthDate, notes]);

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

        const name = fullName.trim();
        const phoneTrimmed = phone.trim();

        if (!phoneTrimmed) {
            setError("Mobil nömrə mütləqdir.");
            return;
        }

        if (!name) {
            setError("Pasiyent adı mütləqdir.");
            return;
        }

        const duplicate = existingPatients.find(
            (p) => p.phone === phoneTrimmed && p.id !== (initialPatient?.id || null)
        );

        if (duplicate) {
            setError("Bu nömrə üzrə pasiyent artıq mövcuddur.");
            return;
        }

        const nowIso = new Date().toISOString();

        const patient = {
            id: initialPatient?.id || String(Date.now()),
            fullName: name,
            phone: phoneTrimmed,
            email: email.trim(),
            birthDate: birthDate || "",
            notes: notes.trim(),
            lastVisit: initialPatient?.lastVisit || null,
            totalVisits: initialPatient?.totalVisits ?? 0,
            createdAt: initialPatient?.createdAt || nowIso,
        };

        onSave && onSave(patient, mode);
    };

    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>{isEdit ? "Pasiyenti dəyiş" : "Yeni pasiyent"}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.row}>
                        <label>Ad Soyad</label>
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
                            onChange={handlePhoneChange}
                            placeholder="+994..."
                        />
                    </div>

                    <div className={styles.row}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@mail.com"
                        />
                    </div>

                    <div className={styles.row}>
                        <label>Doğum tarixi</label>
                        <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                        />
                    </div>

                    <div className={styles.row}>
                        <label>Qeyd</label>
                        <textarea
                            className={styles.textarea}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Xüsusi qeydlər..."
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
                            {isEdit ? "Yadda saxla" : "Yarat"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
