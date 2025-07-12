import { toZonedTime } from "date-fns-tz";
import React, { useEffect, useState } from "react";
import { PresentationLocationLabelMap } from "@/Presentation/assets/data/maps";
import {
  axiosDeleteAdminSlot,
  axiosUpdateAdminPresentation,
  axiosUpdateAdminSlot,
} from "@/Presentation/api/axios/axios.custom";

interface PresentationUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventData: any;
  onSuccess: () => void;
}

export const PresentationUpdateModal: React.FC<
  PresentationUpdateModalProps
> = ({ isOpen, onClose, eventData, onSuccess }) => {
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [location, setLocation] = useState<string>("BASEMENT");
  const [title, setTitle] = useState<string>("");
  const [isSlot, setIsSlot] = useState<boolean>(false);
  const [currentHour, setCurrentHour] = useState<string>("09");
  const [currentMinute, setCurrentMinute] = useState<string>("00");

  useEffect(() => {
    if (eventData) {
      const kstDate = toZonedTime(new Date(eventData.start), "Asia/Seoul");
      const dateString = kstDate.toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const timeString = kstDate.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      setDate(dateString);

      // calendarId "2" == Open Slot, "1" == Scheduled, "3" == Canceled
      const slot = eventData.calendarId === "2";
      setIsSlot(slot);

      setTitle(!slot ? eventData.title || "" : "");

      // 시간은 slot이면 eventData.title(예: "14:00"), 아니면 timeString
      const effectiveTimeString = slot ? eventData.title : timeString;
      setTime(effectiveTimeString);
      const [hour, minute] = effectiveTimeString.split(":");
      setCurrentHour(hour);
      setCurrentMinute(minute);

      if (eventData.location) {
        setLocation(eventData.location);
      }
    }
  }, [eventData]);

  if (!isOpen) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !eventData.id) return;
    const dateTimeString = `${date}T${currentHour}:${currentMinute}:00`;
    try {
      if (isSlot) {
        const slotId = eventData.id.replace("slot-", "");
        await axiosUpdateAdminSlot(slotId, dateTimeString, location);
      } else {
        await axiosUpdateAdminPresentation(
          eventData.id,
          dateTimeString,
          location,
          title
        );
      }
      alert("일정이 수정되었습니다.");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("일정 수정 실패:", error);
      alert("일정 수정에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!eventData.id) return;

    if (!window.confirm("해당 슬롯을 삭제하시겠습니까?")) {
      return;
    }

    const slotId = eventData.id.replace("slot-", "");
    try {
      await axiosDeleteAdminSlot(slotId);
      alert("슬롯이 삭제되었습니다.");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("슬롯 삭제 실패:", error);
      alert("슬롯 삭제에 실패했습니다.");
    }
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentHour(e.target.value);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentMinute(e.target.value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-0 animate-fade-in">
        <form onSubmit={handleUpdate} className="px-6 pt-6 pb-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
              {isSlot ? "일정 수정" : "발표 수정"}
            </h2>
            {isSlot && (
              <button
                type="button"
                onClick={handleDelete}
                className="h-7 w-[72px] px-2 py-1 text-xs font-medium text-red-600 bg-red-100 hover:bg-red-200 rounded shadow-none whitespace-nowrap leading-none flex-shrink-0 self-center transition"
              >
                일정 삭제
              </button>
            )}
          </div>
          {/* 제목 */}
          <div className="mb-5">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              예정된 발표
            </label>
            {isSlot ? (
              <div className="w-full h-12 flex items-center rounded-lg border border-gray-100 bg-gray-50 px-3 text-base text-gray-500">
                등록된 발표가 없습니다
              </div>
            ) : (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-12 rounded-lg border border-gray-300 bg-transparent px-3 text-base transition focus:border-primary-600 focus:ring-2 focus:ring-primary-200"
                autoFocus
                style={{ letterSpacing: "-0.5px" }}
                required
              />
            )}
          </div>
          {/* 시작 시간 */}
          <div className="mb-5">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              시작 시간
            </label>
            <div className="flex gap-3">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="flex-1 h-12 rounded-lg border border-gray-300 bg-transparent px-3 text-base transition focus:border-primary-600 focus:ring-2 focus:ring-primary-200"
                required
              />
              <select
                value={currentHour}
                onChange={handleHourChange}
                className="w-16 h-12 rounded-lg border border-gray-300 bg-transparent px-3 text-base transition focus:border-primary-600 focus:ring-2 focus:ring-primary-200"
                required
              >
                {Array.from({ length: 14 }, (_, i) => 9 + i).map((hour) => (
                  <option key={hour} value={String(hour).padStart(2, "0")}>
                    {String(hour).padStart(2, "0")}
                  </option>
                ))}
              </select>
              <span className="flex items-center text-lg font-medium">:</span>
              <select
                value={currentMinute}
                onChange={handleMinuteChange}
                className="w-16 h-12 rounded-lg border border-gray-300 bg-transparent px-3 text-base transition focus:border-primary-600 focus:ring-2 focus:ring-primary-200"
                required
              >
                <option value="00">00</option>
                <option value="30">30</option>
              </select>
            </div>
          </div>
          {/* 장소 */}
          <div className="mb-5">
            <label
              htmlFor="location"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              장소
            </label>
            <select
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-12 rounded-lg border border-gray-300 bg-transparent px-3 text-base transition focus:border-primary-600 focus:ring-2 focus:ring-primary-200"
              required
            >
              <option value="">장소를 선택하세요</option>
              {Object.entries(PresentationLocationLabelMap).map(
                ([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                )
              )}
            </select>
          </div>
          <div className="flex justify-end items-center pt-4 border-t border-gray-100">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-5 py-2 font-medium text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition shadow-none"
                style={{
                  minWidth: 80,
                }}
              >
                취소
              </button>
              <button
                type="submit"
                className="rounded-lg px-5 py-2 font-medium text-sm text-white bg-primary-600 hover:bg-primary-700 transition shadow-none"
                style={{
                  minWidth: 80,
                  backgroundColor: "#1A73E8",
                }}
              >
                수정
              </button>
            </div>
          </div>
        </form>
      </div>
      {/* 애니메이션 */}
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: scale(0.97);}
          100% { opacity: 1; transform: scale(1);}
        }
        .animate-fade-in {
          animation: fade-in 0.16s cubic-bezier(.2,.8,.4,1) 1;
        }
      `}</style>
    </div>
  );
};
