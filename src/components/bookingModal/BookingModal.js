"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./bookingModal.module.css";
import { format } from "date-fns";

export default function BookingModal({
                                         slot,
                                         mode = "create",              // "create" | "edit"
                                         initialEvent = null,
                                         services = [],
                                         existingClients = [],
                                         errorMessage,
                                         onClose,
                                         onSave,
                                     }) {
    const isEdit = mode === "edit";
    const isOpen = !!(slot || initialEvent);

    const baseStart = useMemo(() => {
        if (isEdit && initialEvent?.start) return new Date(initialEvent.start);
        if (slot?.start) return new Date(slot.start);
        return new Date();
    }, [isEdit, initialEvent, slot]);

    const [fullName, setFullName] = useState(initialEvent?.patientName || "");
    const [phone, setPhone] = useState(initialEvent?.phone || "");
    const defaultServiceId =
        initialEvent?.serviceId || (services[0] && services[0].id) || "";
    const [serviceId, setServiceId] = useState(defaultServiceId);
    const [duration, setDuration] = useState(
        initialEvent?.durationMinutes || 15
    );

    const [localError, setLocalError] = useState("");
    const [matchedClient, setMatchedClient] = useState(null);

    const [startDateStr, setStartDateStr] = useState("");
    const [startTimeStr, setStartTimeStr] = useState("");

    useEffect(() => {
        const dateStr = format(baseStart, "yyyy-MM-dd");
        const timeStr = format(baseStart, "HH:mm");
        setStartDateStr(dateStr);
        setStartTimeStr(timeStr);
    }, [baseStart]);

    useEffect(() => {
        const trimmed = phone.trim();
        if (!trimmed) {
            setMatchedClient(null);
            return;
        }

        const existing =
            existingClients.find((c) => c.phone === trimmed) || null;
        setMatchedClient(existing);

        if (existing) {
            setFullName(existing.fullName || "");
        }
    }, [phone, existingClients]);

    if (!isOpen) return null;

    const handlePhoneChange = (e) => {
        let value = e.target.value;

        // разрешаем только + в начале и цифры
        if (value.startsWith("+")) {
            value = "+" + value.slice(1).replace(/\D/g, "");
        } else {
            value = value.replace(/\D/g, "");
        }

        setPhone(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLocalError("");

        const name = fullName.trim();
        const phoneTrimmed = phone.trim();

        if (!phoneTrimmed) {
            setLocalError("Mobil nömrə mütləqdir.");
            return;
        }

        if (!matchedClient && !name) {
            setLocalError("Pasiyent adı mütləqdir.");
            return;
        }

        if (!startDateStr || !startTimeStr) {
            setLocalError("Başlama tarixi və saatı mütləqdir.");
            return;
        }

        const [yearStr, monthStr, dayStr] = startDateStr.split("-");
        const [hourStr, minuteStr] = (startTimeStr || "").split(":");

        const year = Number(yearStr);
        const month = Number(monthStr);
        const day = Number(dayStr);
        const hour = Number(hourStr);
        const minute = Number(minuteStr);

        if (
            Number.isNaN(year) ||
            Number.isNaN(month) ||
            Number.isNaN(day) ||
            Number.isNaN(hour) ||
            Number.isNaN(minute)
        ) {
            setLocalError("Başlama vaxtı düzgün deyil.");
            return;
        }

        const start = new Date(year, month - 1, day, hour, minute, 0, 0);
        const end = new Date(start.getTime() + duration * 60000);

        const selectedService = services.find((s) => s.id === serviceId);

        const finalClientId =
            matchedClient?.id ?? initialEvent?.clientId ?? null;
        const finalName = matchedClient?.fullName || name;

        const newId = isEdit ? initialEvent.id : Date.now();

        const newEvent = {
            id: newId,
            type: initialEvent?.type || "booking",
            status: initialEvent?.status || "active",
            serviceId,
            serviceName: selectedService?.name || "",
            clientId: finalClientId,
            patientName: finalName,
            phone: phoneTrimmed,
            start,
            end,
            durationMinutes: duration,
        };

        onSave && onSave(newEvent, mode);
    };

    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>{isEdit ? "Randevunu dəyiş" : "Yeni randevu"}</h2>
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
                            disabled={!!matchedClient}
                        />
                        {matchedClient && (
                            <div className={styles.infoBox}>
                                Bu nömrə üzrə pasiyent mövcuddur:{" "}
                                <strong>{matchedClient.fullName}</strong>.
                                Bu pasiyent istifadə olunacaq.
                            </div>
                        )}
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
                        <label>Xidmət</label>
                        <select
                            value={serviceId}
                            onChange={(e) => setServiceId(e.target.value)}
                        >
                            {services.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
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
                        <div className={styles.inlineFields}>
                            <input
                                type="date"
                                value={startDateStr}
                                onChange={(e) => setStartDateStr(e.target.value)}
                            />
                            <input
                                type="time"
                                step="900"
                                value={startTimeStr}
                                onChange={(e) => setStartTimeStr(e.target.value)}
                            />
                        </div>
                    </div>

                    {(localError || errorMessage) && (
                        <div className={styles.error}>
                            {localError || errorMessage}
                        </div>
                    )}

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
