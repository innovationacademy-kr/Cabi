import React, { useEffect, useState } from "react";
import { PresentationLocationLabelMap } from "@/Presentation/assets/data/maps";
import { axiosCreateAdminPresentationSlot } from "@/Presentation/api/axios/axios.custom";

interface PresentationRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  onSuccess: () => void;
}

export const PresentationRegistrationModal: React.FC<
  PresentationRegistrationModalProps
> = ({ isOpen, onClose, selectedDate, onSuccess }) => {
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  useEffect(() => {
    if (selectedDate) {
      const kstDateString = selectedDate.toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Seoul",
      });
      setDate(kstDateString);
    }
  }, [selectedDate]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;
    const dateTimeString = `${date}T${time}:00`;
    try {
      await axiosCreateAdminPresentationSlot(dateTimeString, location);
      alert("일정이 추가되었습니다.");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("일정 추가 실패:", error);
      alert("일정 추가에 실패했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white px-6 py-8 shadow-xl">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">일정 추가</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 시작 시간 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              시작 시간
            </label>
            <div className="flex gap-3">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="flex-1 h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-28 h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* 장소 */}
          <div>
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              장소
            </label>
            <select
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* 버튼 */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-lg bg-gray-200 px-5 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              취소
            </button>
            <button
              type="submit"
              className="h-10 rounded-lg bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700"
            >
              완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
