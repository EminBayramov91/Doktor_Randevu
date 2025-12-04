"use client";

import {useEffect, useMemo, useState} from "react";
import {format} from "date-fns";
import {az as azLocale} from "date-fns/locale";
import styles from "./bookingModal.module.css";
import NewClientModal from "@/components/newClientModal/NewClientModal";

export default function BookingModal({
                                         slot,
                                         mode = "create",
                                         initialEvent = null,
                                         services = [],
                                         existingClients = [],
                                         errorMessage,
                                         onClose,
                                         onSave,
                                     }) {
    const isEdit = mode === "edit";
    const isOpen = !!(slot || initialEvent);

    const baseDate = useMemo(() => {
        if (isEdit && initialEvent?.start) return new Date(initialEvent.start);
        if (slot?.start) return new Date(slot.start);
        return new Date();
    }, [isEdit, initialEvent, slot]);

    const defaultServiceId = initialEvent?.serviceId || "";


    const [serviceId, setServiceId] = useState(defaultServiceId);
    const [serviceMenuOpen, setServiceMenuOpen] = useState(false);

    const selectedService = useMemo(
        () => services.find((s) => s.id === serviceId) || null,
        [services, serviceId]
    );

    const durationMinutes =
        selectedService?.durationMinutes ??
        selectedService?.duration ??
        initialEvent?.durationMinutes ??
        15;

    const [startTimeStr, setStartTimeStr] = useState("");

    useEffect(() => {
        const from = isEdit && initialEvent?.start ? new Date(initialEvent.start) : baseDate;
        setStartTimeStr(format(from, "HH:mm"));
    }, [baseDate, isEdit, initialEvent]);

    const [patientQuery, setPatientQuery] = useState(
        initialEvent?.patientName || ""
    );
    const [selectedClient, setSelectedClient] = useState(() => {
        if (initialEvent?.clientId) {
            return (
                existingClients.find((c) => c.id === initialEvent.clientId) || null
            );
        }
        return null;
    });
    const [patientListOpen, setPatientListOpen] = useState(false);
    const [showNewClientModal, setShowNewClientModal] = useState(false);

    const [localError, setLocalError] = useState("");

    const matchedClients = useMemo(() => {
        const q = patientQuery.trim().toLowerCase();
        if (!q) return existingClients;
        return existingClients.filter((c) =>
            (c.fullName || "")
                .toString()
                .toLowerCase()
                .includes(q)
        );
    }, [existingClients, patientQuery]);

    if (!isOpen) return null;

    const dayLabel = format(baseDate, "EEE d MMM", {locale: azLocale});

    const computeEndTimeStr = () => {
        if (!startTimeStr || !durationMinutes) return "";
        const [hourStr, minStr] = startTimeStr.split(":");
        const start = new Date(
            baseDate.getFullYear(),
            baseDate.getMonth(),
            baseDate.getDate(),
            Number(hourStr) || 0,
            Number(minStr) || 0,
            0,
            0
        );
        const end = new Date(start.getTime() + durationMinutes * 60000);
        return format(end, "HH:mm");
    };

    const endTimeStr = computeEndTimeStr();

    const handleStartTimeChange = (e) => {
        setStartTimeStr(e.target.value);
    };

    const handleServiceSelect = (service) => {
        setServiceId(service.id);
        setServiceMenuOpen(false);
    };

    const handleClientSelect = (client) => {
        setSelectedClient(client);
        setPatientQuery(client.fullName || "");
        setPatientListOpen(false);
    };

    const handleClientCreated = (client) => {
        setSelectedClient(client);
        setPatientQuery(client.fullName || "");
        setShowNewClientModal(false);
        setPatientListOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLocalError("");

        if (!selectedService) {
            setLocalError("Xidmət seçilməyib.");
            return;
        }

        if (!selectedClient) {
            setLocalError("Pasiyent seçilməyib.");
            return;
        }

        if (!startTimeStr) {
            setLocalError("Başlama saatı göstərilməyib.");
            return;
        }

        const [hourStr, minuteStr] = (startTimeStr || "").split(":");
        const hour = Number(hourStr);
        const minute = Number(minuteStr);

        if (Number.isNaN(hour) || Number.isNaN(minute)) {
            setLocalError("Başlama saatı düzgün deyil.");
            return;
        }

        const start = new Date(
            baseDate.getFullYear(),
            baseDate.getMonth(),
            baseDate.getDate(),
            hour,
            minute,
            0,
            0
        );

        const end = new Date(start.getTime() + durationMinutes * 60000);

        const newId = isEdit ? initialEvent.id : Date.now();

        const newEvent = {
            id: newId,
            type: initialEvent?.type || "booking",
            status: initialEvent?.status || "active",
            serviceId: selectedService.id,
            serviceName: selectedService.name,
            color: selectedService.color || null,
            clientId: selectedClient.id || null,
            patientName: selectedClient.fullName,
            phone: selectedClient.phone || null,
            start,
            end,
            durationMinutes,
        };

        onSave && onSave(newEvent, mode);
    };

    return (
        <>
            <div className={styles.backdrop}>
                <div className={styles.modal}>
                    <div className={styles.header}>
                        <h2>{isEdit ? "Randevunu dəyiş" : "Yeni Randevu"}</h2>
                        <button className={styles.closeBtn} onClick={onClose}>
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.row}>
                            <div
                                className={styles.serviceSelect}
                                onClick={() => setServiceMenuOpen((p) => !p)}
                            >
                                <div className={styles.serviceLeft}>
                  <span
                      className={styles.serviceDot}
                      style={{
                          backgroundColor:
                              selectedService?.color || "#4caf50",
                          opacity: selectedService ? 1 : 0.4,
                      }}
                  />
                                    <span
                                        className={
                                            selectedService
                                                ? styles.serviceLabel
                                                : styles.servicePlaceholder
                                        }
                                    >{selectedService ? selectedService.name : "Servis seçimi"}</span>
                                </div>
                                <span className={styles.serviceCaret}>▾</span>
                            </div>

                            {serviceMenuOpen && (
                                <div className={styles.serviceDropdown}>
                                    {services.map((s) => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            className={styles.serviceOption}
                                            onClick={() => handleServiceSelect(s)}
                                        >
                      <span className={styles.serviceLeft}>
                        <span
                            className={styles.serviceDot}
                            style={{
                                backgroundColor: s.color || "#4caf50",
                            }}
                        />
                        <span className={styles.serviceLabel}>{s.name}</span>
                      </span>
                                            {s.durationMinutes || s.duration ? (
                                                <span className={styles.serviceDuration}>
                          {(s.durationMinutes || s.duration) + " dəq"}
                        </span>
                                            ) : null}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {selectedService && (
                                <div className={styles.serviceInfo}>
                                    Müddət: {durationMinutes} dəq
                                </div>
                            )}
                        </div>

                        <div className={styles.row}>
                            <label className={styles.fieldLabel}>Tarix və saat</label>
                            <div className={styles.timeRow}>
                                <div className={styles.timeDate}>
                                    <span className={styles.timeIcon}>🕒</span>
                                    <span>{dayLabel}</span>
                                </div>
                                <div className={styles.timeInputs}>
                                    <input
                                        type="time"
                                        step="900"
                                        value={startTimeStr}
                                        onChange={handleStartTimeChange}
                                    />
                                    <span className={styles.timeDash}>-</span>
                                    <span className={styles.timeReadonly}>{endTimeStr}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <label className={styles.fieldLabel}>Pasiyent</label>
                            <div
                                className={`${styles.patientInputWrapper} ${
                                    !selectedClient && localError ? styles.inputError : ""
                                }`}
                            >
                                <span className={styles.patientIcon}>👤</span>
                                <input
                                    type="text"
                                    value={patientQuery}
                                    onChange={(e) => {
                                        setPatientQuery(e.target.value);
                                        setSelectedClient(null);
                                        setPatientListOpen(true);
                                    }}
                                    onFocus={() => setPatientListOpen(true)}
                                    placeholder="Pasiyent"
                                />
                            </div>

                            {patientListOpen && (
                                <div className={styles.patientDropdown}>
                                    {matchedClients.map((c) => (
                                        <button
                                            key={c.id}
                                            type="button"
                                            className={styles.patientItem}
                                            onClick={() => handleClientSelect(c)}
                                        >
                                            <div className={styles.patientAvatar}>
                                                {(c.fullName || "?")
                                                    .trim()
                                                    .split(" ")
                                                    .map((s) => s[0])
                                                    .join("")
                                                    .slice(0, 2)
                                                    .toUpperCase()}
                                            </div>
                                            <div className={styles.patientInfo}>
                                                <div className={styles.patientName}>{c.fullName}</div>
                                                {c.phone && (
                                                    <div className={styles.patientPhone}>{c.phone}</div>
                                                )}
                                            </div>
                                        </button>
                                    ))}

                                    <button
                                        type="button"
                                        className={styles.newClientBtn}
                                        onClick={() => setShowNewClientModal(true)}
                                    >
                                        + Yeni pasiyent yarat
                                    </button>
                                </div>
                            )}
                        </div>

                        {(localError || errorMessage) && (
                            <div className={styles.error}>{localError || errorMessage}</div>
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

            <NewClientModal
                isOpen={showNewClientModal}
                existingClients={existingClients}
                onClose={() => setShowNewClientModal(false)}
                onCreate={handleClientCreated}
            />
        </>
    );
}
