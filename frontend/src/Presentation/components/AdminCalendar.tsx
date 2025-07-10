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
  const calendarRef = useRef(null);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const yearMonth = new Date().toISOString().slice(0, 7);

        const [presentationsResponse, slotsResponse] = await Promise.all([
          getAdminPresentationsByYearMonth(yearMonth),
          getAdminAvailableSlots(yearMonth),
        ]);

        const presentationEvents = presentationsResponse.data.map(
          (item: AdminPresentationCalendarItemDto) => ({
            id: item.presentationId.toString(),
            calendarId: item.canceled ? "3" : "1", // Canceled or Scheduled
            title: item.title,
            category: "time",
            start: item.startTime,
            end: new Date(
              new Date(item.startTime).getTime() + 60 * 60 * 1000
            ).toISOString(), // Assuming 1 hour duration
            location: item.presentationLocation,
            state: item.canceled ? "Canceled" : "Scheduled",
          })
        );

        const availableSlotsEvents = slotsResponse.data.map(
          (item: AdminAvailableSlotDto) => ({
            id: `slot-${item.slotId}`,
            calendarId: "2", // 열려있는 발표
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
  }, []);

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
