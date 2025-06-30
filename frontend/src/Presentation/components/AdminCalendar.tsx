import Calendar from "@toast-ui/react-calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import { useRef } from "react";

export function AdminCalendar() {
  const calendarRef = useRef(null);

  // TODO: Mock 데이터 수정하기
  const events = [
    {
      id: "1",
      calendarId: "1",
      title: "회의",
      category: "time",
      start: new Date().toISOString(),
      end: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      calendarId: "1",
      title: "워크샵",
      category: "allday",
      start: new Date().toISOString(),
      end: new Date().toISOString(),
      isAllday: true,
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0001", padding: 24 }}>
      <Calendar
        ref={calendarRef}
        height="700px"
        view="month"
        usageStatistics={false}
        isReadOnly={true}
        events={events}
        month={{ startDayOfWeek: 0 }}
        week={{ showTimezoneCollapseButton: true }}
      />
    </div>
  );
}
