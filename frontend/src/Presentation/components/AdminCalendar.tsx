import Calendar from "@toast-ui/calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import "@toast-ui/calendar/dist/toastui-calendar.css";
import React, { useEffect, useRef } from "react";

const AdminCalendar: React.FC = () => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const calendarInstanceRef = useRef<Calendar | null>(null);

  useEffect(() => {
    if (calendarRef.current) {
      calendarInstanceRef.current = new Calendar(calendarRef.current, {
        defaultView: "month",
        useFormPopup: true,
        useDetailPopup: true,
        calendars: [
          {
            id: "1",
            name: "발표 슬롯",
            backgroundColor: "#03bd9e",
            borderColor: "#03bd9e",
          },
        ],
      });
    }

    return () => {
      calendarInstanceRef.current?.destroy();
    };
  }, []);

  return <div ref={calendarRef} style={{ height: "600px" }} />;
};

export default AdminCalendar;
