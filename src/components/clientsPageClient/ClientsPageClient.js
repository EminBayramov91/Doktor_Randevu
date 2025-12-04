"use client";

import { useMemo, useState } from "react";
import styles from "./clientsPageClient.module.css";
import PatientModal from "@/components/patientModal/PatientModal";


const INITIAL_PATIENTS = [
    {
        id: "p1",
        fullName: "A A",
        phone: "+994501111111",
        email: "a@example.com",
        birthDate: "1990-01-01",
        notes: "Qan təzyiqi",
        lastVisit: "2025-11-20T10:00:00Z",
        totalVisits: 3,
        createdAt: "2025-10-01T09:00:00Z",
    },
    {
        id: "p2",
        fullName: "B B",
        phone: "+994502222222",
        email: "b@example.com",
        birthDate: "1985-05-15",
        notes: "Şəkər",
        lastVisit: "2025-11-28T09:30:00Z",
        totalVisits: 5,
        createdAt: "2025-09-10T10:30:00Z",
    },
    {
        id: "p3",
        fullName: "C C",
        phone: "+994503333333",
        email: "",
        birthDate: "",
        notes: "",
        lastVisit: null,
        totalVisits: 0,
        createdAt: "2025-11-01T08:00:00Z",
    },
];

function formatDateShort(iso) {
    if (!iso) return "-";
    const d = new Date(iso);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
}

export default function ClientsPageClient() {
    const [patients, setPatients] = useState(INITIAL_PATIENTS);
    const [selectedId, setSelectedId] = useState(INITIAL_PATIENTS[0]?.id || null);
    const [search, setSearch] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);

    const filteredPatients = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return patients;

        return patients.filter((p) => {
            const name = (p.fullName || "").toLowerCase();
            const phone = (p.phone || "").toLowerCase();
            return name.includes(q) || phone.includes(q);
        });
    }, [patients, search]);

    const selectedPatient = useMemo(
        () => patients.find((p) => p.id === selectedId) || null,
        [patients, selectedId]
    );

    const handleAddClick = () => {
        setEditingPatient(null);
        setIsModalOpen(true);
    };

    const handleRowClick = (patient) => {
        setSelectedId(patient.id);
    };

    const handleEditClick = (patient, e) => {
        e.stopPropagation();
        setEditingPatient(patient);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (patient, e) => {
        e.stopPropagation();
        const ok = window.confirm(
            `"${patient.fullName}" pasiyentini silmək istəyirsiniz?`
        );
        if (!ok) return;

        setPatients((prev) => prev.filter((p) => p.id !== patient.id));
        if (selectedId === patient.id) {
            const next = patients.find((p) => p.id !== patient.id) || null;
            setSelectedId(next ? next.id : null);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPatient(null);
    };

    const handleSavePatient = (patientData, mode) => {
        if (mode === "edit") {
            setPatients((prev) =>
                prev.map((p) => (p.id === patientData.id ? patientData : p))
            );
            setSelectedId(patientData.id);
        } else {
            setPatients((prev) => [...prev, patientData]);
            setSelectedId(patientData.id);
        }

        setIsModalOpen(false);
        setEditingPatient(null);
    };

    return (
        <div className={styles.page}>
            <div className={styles.headerRow}>
                <h1 className={styles.title}>Müştəri siyahısı</h1>

                <div className={styles.headerActions}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Axtar: ad, nömrə..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        type="button"
                        className={styles.addBtn}
                        onClick={handleAddClick}
                    >
                        Yeni pasiyent
                    </button>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.listPane}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>Ad Soyad</th>
                            <th>Mobil nömrə</th>
                            <th>Email</th>
                            <th>Son vizit</th>
                            <th>Vizit sayı</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredPatients.length === 0 && (
                            <tr>
                                <td colSpan={6} className={styles.emptyCell}>
                                    Nəticə tapılmadı.
                                </td>
                            </tr>
                        )}
                        {filteredPatients.map((p) => (
                            <tr
                                key={p.id}
                                className={
                                    p.id === selectedId
                                        ? `${styles.row} ${styles.rowSelected}`
                                        : styles.row
                                }
                                onClick={() => handleRowClick(p)}
                            >
                                <td>{p.fullName || "-"}</td>
                                <td>{p.phone || "-"}</td>
                                <td>{p.email || "-"}</td>
                                <td>{formatDateShort(p.lastVisit)}</td>
                                <td>{p.totalVisits ?? 0}</td>
                                <td className={styles.actionsCell}>
                                    <button
                                        type="button"
                                        className={styles.linkBtn}
                                        onClick={(e) => handleEditClick(p, e)}
                                    >
                                        Dəyiş
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.linkBtnDanger}
                                        onClick={(e) => handleDeleteClick(p, e)}
                                    >
                                        Sil
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.detailPane}>
                    {selectedPatient ? (
                        <>
                            <h2 className={styles.detailTitle}>Pasiyent profili</h2>
                            <div className={styles.detailBlock}>
                                <div className={styles.detailLabel}>Ad Soyad</div>
                                <div className={styles.detailValue}>
                                    {selectedPatient.fullName || "-"}
                                </div>
                            </div>
                            <div className={styles.detailBlock}>
                                <div className={styles.detailLabel}>Mobil nömrə</div>
                                <div className={styles.detailValue}>
                                    {selectedPatient.phone || "-"}
                                </div>
                            </div>
                            <div className={styles.detailBlock}>
                                <div className={styles.detailLabel}>Email</div>
                                <div className={styles.detailValue}>
                                    {selectedPatient.email || "-"}
                                </div>
                            </div>
                            <div className={styles.detailBlock}>
                                <div className={styles.detailLabel}>Doğum tarixi</div>
                                <div className={styles.detailValue}>
                                    {selectedPatient.birthDate
                                        ? formatDateShort(selectedPatient.birthDate)
                                        : "-"}
                                </div>
                            </div>
                            <div className={styles.detailBlock}>
                                <div className={styles.detailLabel}>Son vizit</div>
                                <div className={styles.detailValue}>
                                    {formatDateShort(selectedPatient.lastVisit)}
                                </div>
                            </div>
                            <div className={styles.detailBlock}>
                                <div className={styles.detailLabel}>Vizit sayı</div>
                                <div className={styles.detailValue}>
                                    {selectedPatient.totalVisits ?? 0}
                                </div>
                            </div>
                            <div className={styles.detailBlock}>
                                <div className={styles.detailLabel}>Qeyd</div>
                                <div className={styles.detailValue}>
                                    {selectedPatient.notes || "-"}
                                </div>
                            </div>

                            {/*<div className={styles.detailHint}>*/}
                            {/*    Gələcəkdə: Tabs — Haqqında, Notes, Visit History, Epizodlar,*/}
                            {/*    Aktivlik Logu.*/}
                            {/*</div>*/}
                        </>
                    ) : (
                        <div className={styles.detailEmpty}>
                            Pasiyent seçin və ya yeni pasiyent yaradın.
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <PatientModal
                    mode={editingPatient ? "edit" : "create"}
                    initialPatient={editingPatient}
                    existingPatients={patients}
                    onClose={handleCloseModal}
                    onSave={handleSavePatient}
                />
            )}
        </div>
    );
}
