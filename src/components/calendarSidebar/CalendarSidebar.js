
import MiniCalendar from "@/components/miniCalendar/MiniCalendar";
import styles from "./calendarSidebar.module.css";

export default function CalendarSidebar({ selectedDate, onSelectDate }) {
    return (
        <aside className={styles.sidebar}>
            <MiniCalendar selectedDate={selectedDate} onSelectDate={onSelectDate} />
        </aside>
    );
}
