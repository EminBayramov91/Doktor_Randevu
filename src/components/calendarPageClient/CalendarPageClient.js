"use client";

import { useMemo, useState } from "react";
import styles from "./calendarPageClient.module.css";
import CalendarSidebar from "@/components/calendarSidebar/CalendarSidebar";
import CalendarWrapper from "@/components/calendarWrapper/CalendarWrapper";
import { useGetServicesQuery } from "@/store/api/simplybookApi";

const INITIAL_EVENTS = [
    {
        id: 1,
        type: "booking",
        status: "active",
        serviceId: "exam",
        serviceName: "Müayinə",
        clientId: "c1",
        patientName: "A A",
        phone: "+994501111111",
        start: new Date(2025, 11, 4, 9, 0),
        end: new Date(2025, 11, 4, 9, 15),
        durationMinutes: 15,
    },
    {
        id: 2,
        type: "booking",
        status: "active",
        serviceId: "usm",
        serviceName: "USM",
        clientId: "c2",
        patientName: "B B",
        phone: "+994502222222",
        start: new Date(2025, 11, 4, 9, 30),
        end: new Date(2025, 11, 4, 10, 0),
        durationMinutes: 30,
    },
    {
        id: 3,
        type: "booking",
        status: "active",
        serviceId: "consult",
        serviceName: "Konsultasiya",
        clientId: "c3",
        patientName: "C C",
        phone: "+994503333333",
        start: new Date(2025, 11, 4, 10, 0),
        end: new Date(2025, 11, 4, 11, 0),
        durationMinutes: 60,
    },
];

export default function CalendarPageClient() {
    const [date, setDate] = useState(new Date(2025, 11, 4));
    const [view, setView] = useState("day");
    const [isCalendarSidebarOpen, setIsCalendarSidebarOpen] = useState(true);
    const [events, setEvents] = useState(INITIAL_EVENTS);
    const [serviceFilter, setServiceFilter] = useState("all");

    const {
        data: servicesResponse,
        isLoading: isServicesLoading,
        error: servicesError,
    } = useGetServicesQuery();

    const services = useMemo(() => {
        if (!servicesResponse?.data) return [];

        return servicesResponse.data.map((s) => ({
            id: String(s.id),
            name: s.name,
            durationMinutes: s.duration || 15,
            color: s.color || "#4caf50",
        }));
    }, [servicesResponse]);

    const filteredEvents = useMemo(() => {
        if (serviceFilter === "all") return events;

        return events.filter((ev) => {
            if (ev.type === "block") return true;
            return String(ev.serviceId) === String(serviceFilter);
        });
    }, [events, serviceFilter]);

    // Мини-календарь ВСЕГДА меняет date, но НЕ меняет view
    const handleSelectDate = (day) => {
        setDate(day);
    };

    const handleCalendarNavigate = (newDate) => {
        setDate(newDate);
    };

    const handleCalendarViewChange = (newView) => {
        setView(newView);
    };

    const toggleCalendarSidebar = () => {
        setIsCalendarSidebarOpen((prev) => !prev);
    };

    const handleSelectSlot = (slotInfo) => {
        if (view === "month" || view === "agenda") return;
        console.log("Selected slot:", slotInfo);
    };

    const handleSelectEvent = (event) => {
        console.log("Selected event:", event);
    };

    return (
        <div className={styles.wrapper}>
            {servicesError && (
                <div className={styles.errorBar}>
                    Xidmətləri yükləmək mümkün olmadı.
                </div>
            )}

            <CalendarSidebar
                selectedDate={date}
                onSelectDate={handleSelectDate}
                isOpen={isCalendarSidebarOpen}
                onToggle={toggleCalendarSidebar}
                services={services}
                serviceFilter={serviceFilter}
                onServiceFilterChange={setServiceFilter}
                servicesLoading={isServicesLoading}
            />

            <CalendarWrapper
                date={date}
                view={view}
                events={filteredEvents}
                onDateChange={handleCalendarNavigate}
                onViewChange={handleCalendarViewChange}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                services={services}
                serviceFilter={serviceFilter}
                onServiceFilterChange={setServiceFilter}
                servicesLoading={isServicesLoading}
            />
        </div>
    );
}
