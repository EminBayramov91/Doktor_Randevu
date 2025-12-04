import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./page.module.css"
import CalendarPageClient from "@/components/calendarPageClient/CalendarPageClient";

export const metadata = {
    title: 'Calendar',
}

export default function Page() {
    return <CalendarPageClient />;
}