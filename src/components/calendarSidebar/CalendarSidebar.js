import MiniCalendar from "@/components/miniCalendar/MiniCalendar";
import CalendarFilters from "@/components/calendarFilters/CalendarFilters";
import styles from "./calendarSidebar.module.css";
import Image from "next/image";

export default function CalendarSidebar({
                                            selectedDate,
                                            onSelectDate,
                                            isOpen,
                                            onToggle,
                                            services = [],
                                            serviceFilter = "all",
                                            onServiceFilterChange,
                                            servicesLoading = false,
                                        }) {
    return (
        <aside
            className={
                isOpen
                    ? `${styles.sidebar} ${styles.sidebarOpen}`
                    : `${styles.sidebar} ${styles.sidebarClosed}`
            }
        >
            <div className={styles.header}>
                <button
                    type="button"
                    className={styles.toggleBtn}
                    onClick={onToggle}
                    aria-label={isOpen ? "Mini təqvimi gizlət" : "Mini təqvimi göstər"}
                >
                    <span className={styles.chevron}>
                        {isOpen ? (
                            <Image
                                src="/arrow-prev.svg"
                                alt="arrow-prev"
                                width={15}
                                height={15}
                            />
                        ) : (
                            <Image
                                src="/arrow-next.svg"
                                alt="arrow-prev"
                                width={15}
                                height={15}
                            />
                        )}
                    </span>
                </button>
                {isOpen && <span className={styles.title}>Təqvim</span>}
            </div>

            {isOpen && (
                <>
                    <div className={styles.calendarBox}>
                        <MiniCalendar
                            selectedDate={selectedDate}
                            onSelectDate={onSelectDate}
                        />
                    </div>

                    <div className={styles.filtersBox}>
                        <CalendarFilters
                            services={services}
                            serviceFilter={serviceFilter}
                            onChange={onServiceFilterChange}
                            servicesLoading={servicesLoading}
                        />
                    </div>
                </>
            )}
        </aside>
    );
}
