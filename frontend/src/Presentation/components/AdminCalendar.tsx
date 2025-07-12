import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import Calendar from "@toast-ui/react-calendar";
import { toZonedTime } from "date-fns-tz";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getAdminAvailableSlots,
  getAdminPresentationsByYearMonth,
} from "@/Presentation/api/axios/axios.custom";
import { PresentationRegistrationModal } from "./PresentationRegistrationModal";
import { PresentationUpdateModal } from "./PresentationUpdateModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const handleOpenModal = useCallback((date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedDate(null);
    const inst = calendarRef.current?.getInstance?.();
    if (inst?.clearGridSelections) {
      inst.clearGridSelections();
    }
  }, []);

  const handleOpenUpdateModal = useCallback((event: any) => {
    setSelectedEvent(event);
    setIsUpdateModalOpen(true);
  }, []);

  const handleCloseUpdateModal = useCallback(() => {
    setIsUpdateModalOpen(false);
    setSelectedEvent(null);
  }, []);

  const fetchCalendarData = useCallback(async () => {
    try {
      const yearMonth = currentDate.toISOString().slice(0, 7);
      const now = new Date();
      const isPastMonth =
        currentDate.getFullYear() < now.getFullYear() ||
        (currentDate.getFullYear() === now.getFullYear() &&
          currentDate.getMonth() < now.getMonth());

      let presentationsResponse;
      let slotsResponse;

      if (isPastMonth) {
        presentationsResponse = await getAdminPresentationsByYearMonth(
          yearMonth
        );
        slotsResponse = { data: [] };
      } else {
        [presentationsResponse, slotsResponse] = await Promise.all([
          getAdminPresentationsByYearMonth(yearMonth),
          getAdminAvailableSlots(yearMonth),
        ]);
      }

      const presentationEvents = presentationsResponse.data.map(
        (item: any) => ({
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

      const availableSlotsEvents = slotsResponse.data.map((item: any) => ({
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
      }));

      setEvents([...presentationEvents, ...availableSlotsEvents]);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  const handlePrevClick = () => {
    const inst = calendarRef.current?.getInstance?.();
    if (inst) {
      inst.prev();
      setCurrentDate(new Date(inst.getDate()));
    }
  };

  const handleNextClick = () => {
    const inst = calendarRef.current?.getInstance?.();
    if (inst) {
      inst.next();
      setCurrentDate(new Date(inst.getDate()));
    }
  };

  const handleSelectDateTime = useCallback(
    (selectInfo: any) => {
      if (selectInfo.start) {
        const kstDate = toZonedTime(selectInfo.start, "Asia/Seoul");
        handleOpenModal(kstDate);
      }
    },
    [handleOpenModal]
  );

  const handleClickEvent = useCallback(
    (eventInfo: any) => {
      console.log("eventInfo:", eventInfo);
      const event = eventInfo.event;
      if (event && ["1", "2", "3"].includes(event.calendarId)) {
        handleOpenUpdateModal(event);
      }
    },
    [handleOpenUpdateModal]
  );

  return (
    <div className="max-w-[1200px] mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevClick}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-200 transition-all shadow"
          aria-label="이전 달"
          type="button"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 6L9 12L15 18"
              stroke="#222"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h2 className="my-0 text-lg leading-tight font-semibold select-none">
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </h2>
        <button
          onClick={handleNextClick}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-200 transition-all shadow"
          aria-label="다음 달"
          type="button"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 6L15 12L9 18"
              stroke="#222"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <Calendar
        ref={calendarRef}
        height="800px"
        view="month"
        usageStatistics={false}
        isReadOnly={false}
        events={events}
        calendars={calendars}
        month={{ startDayOfWeek: 0 }}
        week={{ showTimezoneCollapseButton: true }}
        useDetailPopup={false}
        onSelectDateTime={handleSelectDateTime}
        onClickEvent={handleClickEvent}
      />
      <PresentationRegistrationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedDate={selectedDate}
        onSuccess={fetchCalendarData}
      />
      <PresentationUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        eventData={selectedEvent}
        onSuccess={fetchCalendarData}
      />
    </div>
  );
}
