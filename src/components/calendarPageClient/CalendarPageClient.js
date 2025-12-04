"use client";

import { useMemo, useState } from "react";
import styles from "./calendarPageClient.module.css";
import CalendarSidebar from "@/components/calendarSidebar/CalendarSidebar";
import CalendarWrapper from "@/components/calendarWrapper/CalendarWrapper";
import BookingModal from "@/components/bookingModal/BookingModal";
import EventDetailsModal from "@/components/eventDetailsModal/EventDetailsModal";

const MOCK_SERVICES = [
    { id: "exam", name: "Müayinə" },
    { id: "usm", name: "USM" },
    { id: "consult", name: "Konsultasiya" },
];

const WORKING_DAY = {
    startHour: 7,
    endHour: 20,
};

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

function pad(n) {
    return n < 10 ? `0${n}` : String(n);
}

function validateWorkingHours(event, workingDay) {
    const { start, end } = event;

    const dayStart = new Date(start);
    dayStart.setHours(workingDay.startHour, 0, 0, 0);

    const dayEnd = new Date(start);
    dayEnd.setHours(workingDay.endHour, 0, 0, 0);

    if (start < dayStart || end > dayEnd) {
        return `Randevu yalnız ${pad(workingDay.startHour)}:00 – ${pad(
            workingDay.endHour
        )}:00 aralığında ola bilər.`;
    }

    return "";
}


function validateOverlap(event, events, ignoreId) {
    const { start, end } = event;

    const hasOverlap = events.some((ev) => {
        if (ev.id === ignoreId) return false;
        if (ev.status === "cancelled") return false;

        return start < ev.end && end > ev.start;
    });

    if (hasOverlap) {
        return "Bu vaxt aralığı artıq doludur.";
    }

    return "";
}

function validateBooking(event, events, workingDay, ignoreId) {
    if (!(event.start instanceof Date) || !(event.end instanceof Date)) {
        return "Daxili xəta: tarix düzgün deyil.";
    }
    if (event.start >= event.end) {
        return "Müddət düzgün deyil.";
    }

    const err1 = validateWorkingHours(event, workingDay);
    if (err1) return err1;

    const err2 = validateOverlap(event, events, ignoreId);
    if (err2) return err2;

    return "";
}

export default function CalendarPageClient() {
    const [date, setDate] = useState(new Date(2025, 11, 4));
    const [view, setView] = useState("day");
    const [isCalendarSidebarOpen, setIsCalendarSidebarOpen] = useState(true);

    const [events, setEvents] = useState(INITIAL_EVENTS);

    const [serviceFilter, setServiceFilter] = useState("all");

    const filteredEvents = useMemo(() => {
        if (serviceFilter === "all") return events;

        return events.filter((ev) => {
            if (ev.type === "block") return true;
            return ev.serviceId === serviceFilter;
        });
    }, [events, serviceFilter]);

    const [slotForCreate, setSlotForCreate] = useState(null);
    const [eventForDetails, setEventForDetails] = useState(null);
    const [eventForEdit, setEventForEdit] = useState(null);
    const [bookingError, setBookingError] = useState("");

    const existingClients = useMemo(() => {
        const map = new Map();
        events.forEach((ev) => {
            if (!ev.phone) return;
            if (!map.has(ev.phone)) {
                map.set(ev.phone, {
                    id: ev.clientId,
                    fullName: ev.patientName,
                    phone: ev.phone,
                });
            }
        });
        return Array.from(map.values());
    }, [events]);

    const handleSelectDateFromMini = (day) => {
        setDate(day);
        setView("day");
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

        setSlotForCreate({ start: slotInfo.start });
        setEventForEdit(null);
        setBookingError("");
    };

    const handleSelectEvent = (event) => {
        setEventForDetails(event);
    };

    const closeBookingModal = () => {
        setSlotForCreate(null);
        setEventForEdit(null);
        setBookingError("");
    };

    const handleSaveBooking = (eventData, mode) => {
        const ignoreId = mode === "edit" ? eventData.id : undefined;
        const error = validateBooking(eventData, events, WORKING_DAY, ignoreId);

        if (error) {
            setBookingError(error);
            return;
        }

        setBookingError("");

        if (mode === "edit") {
            setEvents((prev) =>
                prev.map((ev) => (ev.id === eventData.id ? eventData : ev))
            );
        } else {
            setEvents((prev) => [...prev, eventData]);
        }

        closeBookingModal();
    };

    const handleCancelBooking = (id) => {
        setEvents((prev) =>
            prev.map((ev) =>
                ev.id === id ? { ...ev, status: "cancelled" } : ev
            )
        );
        setEventForDetails(null);
    };

    const handleEditFromDetails = (event) => {
        setEventForEdit(event);
        setSlotForCreate(null);
        setEventForDetails(null);
        setBookingError("");
    };

    const bookingSlot =
        slotForCreate || (eventForEdit ? { start: eventForEdit.start } : null);

    return (
        <div className={styles.wrapper}>
            <CalendarSidebar
                selectedDate={date}
                onSelectDate={handleSelectDateFromMini}
                isOpen={isCalendarSidebarOpen}
                onToggle={toggleCalendarSidebar}
            />

            <CalendarWrapper
                date={date}
                view={view}
                events={filteredEvents}
                onDateChange={handleCalendarNavigate}
                onViewChange={handleCalendarViewChange}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                services={MOCK_SERVICES}
                serviceFilter={serviceFilter}
                onServiceFilterChange={setServiceFilter}
            />

            {(bookingSlot || eventForEdit) && (
                <BookingModal
                    slot={bookingSlot}
                    mode={eventForEdit ? "edit" : "create"}
                    initialEvent={eventForEdit}
                    services={MOCK_SERVICES}
                    existingClients={existingClients}
                    errorMessage={bookingError}
                    onClose={closeBookingModal}
                    onSave={handleSaveBooking}
                />
            )}

            {eventForDetails && (
                <EventDetailsModal
                    event={eventForDetails}
                    onClose={() => setEventForDetails(null)}
                    onCancel={handleCancelBooking}
                    onEdit={handleEditFromDetails}
                />
            )}
        </div>
    );
}
