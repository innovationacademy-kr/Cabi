import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import Calendar from "@toast-ui/react-calendar";
import React, { useRef } from "react";
import "tui-date-picker/dist/tui-date-picker.css";
import "tui-time-picker/dist/tui-time-picker.css";

const AdminCalendar: React.FC = () => {
  const calendarRef = useRef<Calendar>(null);

  const calendars = [
    {
      id: "1",
      name: "발표 슬롯",
      backgroundColor: "#03bd9e",
      borderColor: "#03bd9e",
    },
    {
      id: "2",
      name: "발표 슬롯2",
      backgroundColor: "#4ab4f2",
      borderColor: "#4ab4f2",
    },
    {
      id: "3",
      name: "발표 슬롯3",
      backgroundColor: "#f24a4a",
      borderColor: "#f24a4a",
    },
  ];

  return (
    <div style={{ height: "700px", padding: "20px" }}>
      <Calendar
        ref={calendarRef}
        height="100%"
        view="month"
        useFormPopup={true}
        useDetailPopup={true}
        calendars={calendars}
        usageStatistics={false}
      />
    </div>
  );
};

export default AdminCalendar;
