"use client";

import styles from "./calendarWrapper.module.css";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { az } from "date-fns/locale";
import { format, getDay, parse, startOfWeek } from "date-fns";
import TimeSlotWrapper from "@/components/timeSlotWrapper/TimeSLotWrapper";
import CalendarToolbar from "@/components/calendarToolbar/CalendarToolbar";
import { useState } from "react";
import BookingModal from "@/components/bookingModal/BookingModal";
import EventDetailsModal from "@/components/eventDetailsModal/EventDetailsModal";

const locales = { az };

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

const formats = {
    timeGutterFormat: (date, culture, localizer) =>
        localizer
            .format(date, "haaa")
            .toUpperCase()
            .replace(" ", ""),
};

const initialEvents = [
    {
        id: 1,
        title: "A A – Müayinə",
        patientName: "A A",
        phone: "+994 50 111 11 11",
        service: "Müayinə",
        start: new Date("2025-11-30T09:00:00"),
        end: new Date("2025-11-30T09:15:00"),
    },
    {
        id: 2,
        title: "B B – USM",
        patientName: "B B",
        phone: "+994 50 222 22 22",
        service: "USM",
        start: new Date("2025-11-30T09:30:00"),
        end: new Date("2025-11-30T10:00:00"),
    },
    {
        id: 3,
        title: "C C – Konsultasiya",
        patientName: "C C",
        phone: "+994 50 333 33 33",
        service: "Konsultasiya",
        start: new Date("2025-11-30T10:00:00"),
        end: new Date("2025-11-30T11:00:00"),
    },
    {
        id: 4,
        title: "D D – Müayinə",
        patientName: "D D",
        phone: "+994 50 444 44 44",
        service: "Müayinə",
        start: new Date("2025-11-30T11:15:00"),
        end: new Date("2025-11-30T11:30:00"),
    },
    {
        id: 5,
        title: "E E – USM",
        patientName: "E E",
        phone: "+994 50 555 55 55",
        service: "USM",
        start: new Date("2025-11-30T12:00:00"),
        end: new Date("2025-11-30T12:30:00"),
    },
    {
        id: 6,
        title: "F F – Konsultasiya",
        patientName: "F F",
        phone: "+994 50 666 66 66",
        service: "Konsultasiya",
        start: new Date("2025-11-30T15:00:00"),
        end: new Date("2025-11-30T16:00:00"),
    },
    {
        id: 7,
        title: "G G – Müayinə",
        patientName: "G G",
        phone: "+994 50 777 77 77",
        service: "Müayinə",
        start: new Date("2025-11-29T10:00:00"),
        end: new Date("2025-11-29T10:15:00"),
    },
];

function getDurationMinutes(event) {
    return (event.end.getTime() - event.start.getTime()) / 60000;
}


function eventPropGetter(event) {
    const duration = getDurationMinutes(event);

    let backgroundColor = "#1C274C";
    if (duration <= 15) backgroundColor = "#4CAF50";
    else if (duration <= 30) backgroundColor = "#2196F3";
    else backgroundColor = "#FF9800";

    return {
        style: {
            backgroundColor,
            borderRadius: "6px",
            border: "none",
            color: "#fff",
            fontSize: "12px",
            padding: "2px 4px",
        },
    };
}

export default function CalendarWrapper({ date, view, onDateChange, onViewChange }) {
    const [events, setEvents] = useState(initialEvents);

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [slotForCreate, setSlotForCreate] = useState(null);

    const handleSelectSlot = (slotInfo) => {
        setSlotForCreate({
            start: slotInfo.start,
            end: slotInfo.end,
        });
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
    };

    const handleNavigate = (newDate) => {
        onDateChange && onDateChange(newDate);
    };

    const handleView = (newView) => {
        onViewChange && onViewChange(newView);
    };

    const handleCreateBooking = (newEvent) => {
        setEvents((prev) => [...prev, newEvent]);
    };

    const handleDeleteEvent = (id) => {
        setEvents((prev) => prev.filter((e) => e.id !== id));
        setSelectedEvent(null);
    };

    return (
        <div className={styles.main}>
            <Calendar
                localizer={localizer}
                events={events}
                date={date}
                view={view}
                onNavigate={handleNavigate}
                onView={handleView}
                selectable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                defaultDate={new Date()}
                step={15}
                timeslots={4}
                views={["day", "week", "month", "agenda"]}
                components={{
                    timeSlotWrapper: TimeSlotWrapper,
                    toolbar: CalendarToolbar,
                }}
                formats={formats}
                eventPropGetter={eventPropGetter}
            />

            {slotForCreate && (
                <BookingModal
                    slot={slotForCreate}
                    onClose={() => setSlotForCreate(null)}
                    onSave={handleCreateBooking}
                />
            )}

            {selectedEvent && (
                <EventDetailsModal
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    onDelete={handleDeleteEvent}
                />
            )}
        </div>
    );
}
