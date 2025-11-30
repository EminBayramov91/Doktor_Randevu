"use client";

import { useState } from "react";
import { format, addMinutes } from "date-fns";

export default function TimeSlotWrapper({ children, value }) {
    const [hovered, setHovered] = useState(false);

    const startLabel = format(value, "H:mm");
    const endLabel = format(addMinutes(value, 15), "H:mm");
    const label = `${startLabel} – ${endLabel}`;

    return (
        <div
            className="dr-slot-wrapper"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {hovered && (
                <div className="dr-slot-tooltip">
                    {label}
                </div>
            )}
            {children}
        </div>
    );
}
