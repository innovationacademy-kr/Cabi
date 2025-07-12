import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import Calendar from "@toast-ui/react-calendar";
import { useEffect, useRef, useState } from "react";
import {
  getAdminAvailableSlots,
  getAdminPresentationsByYearMonth,
} from "@/Presentation/api/axios/axios.custom";

interface AdminPresentationCalendarItemDto {
  presentationId: number;
  slotId: number;
  startTime: string;
  title: string;
  presentationLocation: string;
  canceled: boolean;
}

interface AdminAvailableSlotDto {
  slotId: number;
  startTime: string;
  presentationLocation: string;
}

const calendars = [
  {
    id: "1",
    name: "Scheduled",
    backgroundColor: "#5278FD",
    borderColor: "#5278FD",
    color: "#ffffff",
  },
  {
    id: "2",
    name: "Open Slot",
    backgroundColor: "#5278FD",
    borderColor: "#5278FD",
    color: "#ffffff",
  },
  {
    id: "3",
    name: "Canceled",
    backgroundColor: "#FF3F3F",
    borderColor: "#FF3F3F",
    color: "#ffffff",
  },
];

export function AdminCalendar() {
  const calendarRef = useRef<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const yearMonth = currentDate.toISOString().slice(0, 7);

        const [presentationsResponse, slotsResponse] = await Promise.all([
          getAdminPresentationsByYearMonth(yearMonth),
          getAdminAvailableSlots(yearMonth),
        ]);

        const presentationEvents = presentationsResponse.data.map(
          (item: AdminPresentationCalendarItemDto) => ({
            id: item.presentationId.toString(),
            calendarId: item.canceled ? "3" : "1",
            title: item.title,
            category: "time",
            start: item.startTime,
            end: new Date(
              new Date(item.startTime).getTime() + 60 * 60 * 1000
            ).toISOString(),
            location: item.presentationLocation,
            state: item.canceled ? "Canceled" : "Scheduled",
          })
        );

        const availableSlotsEvents = slotsResponse.data.map(
          (item: AdminAvailableSlotDto) => ({
            id: `slot-${item.slotId}`,
            calendarId: "2",
            title: new Date(item.startTime).toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
            category: "allday",
            start: item.startTime,
            end: item.startTime,
            isAllday: true,
          })
        );

        setEvents([...presentationEvents, ...availableSlotsEvents]);
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      }
    };

    fetchCalendarData();
  }, [currentDate]);

  const handlePrevClick = () => {
    if (calendarRef.current) {
      calendarRef.current.getInstance().prev();
      setCurrentDate(new Date(calendarRef.current.getInstance().getDate()));
    }
  };

  const handleNextClick = () => {
    if (calendarRef.current) {
      calendarRef.current.getInstance().next();
      setCurrentDate(new Date(calendarRef.current.getInstance().getDate()));
    }
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px #0001",
        padding: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <button
          onClick={handlePrevClick}
          style={{
            padding: "8px 12px",
            cursor: "pointer",
            backgroundColor: "#f0f0f0",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          &lt;
        </button>
        <h2>
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </h2>
        <button
          onClick={handleNextClick}
          style={{
            padding: "2px 2px",
            cursor: "pointer",
            backgroundColor: "#f0f0f0",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          &gt;
        </button>
      </div>
      <Calendar
        ref={calendarRef}
        height="700px"
        view="month"
        usageStatistics={false}
        isReadOnly={true}
        events={events}
        calendars={calendars}
        month={{ startDayOfWeek: 0 }}
        week={{ showTimezoneCollapseButton: true }}
      />
    </div>
  );
}
