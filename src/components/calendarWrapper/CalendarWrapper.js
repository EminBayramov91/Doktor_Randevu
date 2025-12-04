"use client";

import styles from "./calendarWrapper.module.css";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { az } from "date-fns/locale";
import { format, getDay, parse, startOfWeek } from "date-fns";
import TimeSlotWrapper from "@/components/timeSlotWrapper/TimeSLotWrapper";
import CalendarToolbar from "@/components/calendarToolbar/CalendarToolbar";
import { SERVICES } from "@/config/services"

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
        localizer.format(date, "HH:mm"),
    dayFormat: (date, culture, localizer) =>
        localizer.format(date, "dd MMM EEE"),
};


const serviceColorMap = SERVICES.reduce((acc, s) => {
    acc[s.id] = s.color;
    return acc;
}, {});

function eventStyleGetter(event) {
    let backgroundColor = "#1c274c";
    let opacity = 1;

    if (event.type === "block") {
        backgroundColor = "#9e9e9e";
    } else {
        backgroundColor =
            event.color ||
            (event.serviceId && serviceColorMap[event.serviceId]) ||
            "#1c274c";
    }

    if (event.status === "cancelled") {
        opacity = 0.4;
    }

    return {
        style: {
            backgroundColor,
            opacity,
            borderRadius: 4,
            border: "none",
            color: "#fff",
            fontSize: 12,
        },
    };
}

const messages = {
    today: "Bu gün",
    previous: "Öncəki",
    next: "Növbəti",
    day: "Gün",
    week: "Həftə",
    month: "Ay",
    agenda: "Siyahı",
    date: "Tarix",
    time: "Saat",
    event: "Randevu",
};

export default function CalendarWrapper({
                                            date,
                                            view,
                                            events,
                                            onDateChange,
                                            onViewChange,
                                            onSelectSlot,
                                            onSelectEvent,
                                            services = [],
                                            serviceFilter = "all",
                                            onServiceFilterChange,
                                        }) {
    return (
        <div className={styles.main}>
            <Calendar
                culture="az"
                localizer={localizer}
                events={events}
                date={date}
                view={view}
                onNavigate={onDateChange}
                onView={onViewChange}
                selectable
                onSelectSlot={onSelectSlot}
                onSelectEvent={onSelectEvent}
                defaultDate={new Date()}
                step={15}
                timeslots={4}
                views={["day", "week", "month", "agenda"]}
                components={{
                    timeSlotWrapper: TimeSlotWrapper,
                    toolbar: (toolbarProps) => (
                        <CalendarToolbar
                            {...toolbarProps}
                            services={services}
                            serviceFilter={serviceFilter}
                            onServiceFilterChange={onServiceFilterChange}
                        />
                    ),
                }}
                formats={formats}
                min={new Date(2025, 0, 1, 7, 0)}
                max={new Date(2025, 0, 1, 20, 0)}
                eventPropGetter={eventStyleGetter}
                messages={messages}
                enableAutoScroll={false}
            />
        </div>
    );
}
