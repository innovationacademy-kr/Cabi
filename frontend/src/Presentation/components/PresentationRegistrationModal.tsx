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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-0 animate-fade-in">
        <form onSubmit={handleSubmit} className="px-6 pt-6 pb-4">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900 tracking-tight">
            일정 추가
          </h2>
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
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-32 h-12 rounded-lg border border-gray-300 bg-transparent px-3 text-base transition focus:border-primary-600 focus:ring-2 focus:ring-primary-200"
                required
              />
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
          {/* 버튼 영역 */}
          <div className="flex justify-end items-center pt-4 border-t border-gray-100 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-5 py-2 font-medium text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition shadow-none"
              style={{ minWidth: 80 }}
            >
              취소
            </button>
            <button
              type="submit"
              className="rounded-lg px-5 py-2 font-medium text-sm text-white transition shadow-none"
              style={{
                minWidth: 80,
                backgroundColor: "#1A73E8",
              }}
            >
              완료
            </button>
          </div>
        </form>
      </div>
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
