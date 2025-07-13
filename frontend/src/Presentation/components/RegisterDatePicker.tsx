import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Control } from "react-hook-form";
import { axiosGetPresentationsSlot } from "../api/axios/axios.custom";

interface RegisterDatePickerProps {
  control: Control<any>;
  name: string;
  title: string;
  isEditMode?: boolean;
  startTime?: string;
}

// 발표 가능한 시간 슬롯 타입 정의
interface TimeSlot {
  slotId: number;
  startTime: string;
}

// API 응답 타입 정의
interface ApiResponse {
  results: TimeSlot[];
}

const RegisterDatePicker: React.FC<RegisterDatePickerProps> = ({
  control,
  title,
  name,
  isEditMode,
  startTime,
}) => {
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]); // CHECK : useRef 사용하는게 더 좋은지
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlot[]>([]);
  const [selectTime, setSelectTime] = useState<string[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isEditMode) {
      // API에서 발표 가능한 날짜 가져오기
      const fetchAvailableDates = async () => {
        try {
          setIsLoading(true);
          const res = await axiosGetPresentationsSlot();
          setAvailableSlots(res.data.data); // api 명세와 달리 results 가 아닌 data 로 옴
          // console.log("availableSlots : ", availableSlots);
        } catch (error) {
          console.error("발표 가능 날짜 로딩 실패:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAvailableDates();
    }
  }, [isEditMode]);

  // 선택 불가능한 날짜 필터링 함수
  const disabledDays = (date: Date) => {
    // 오늘 이전 날짜
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
      return true;
    }

    // 2. 현재 월부터 3개월 범위 밖의 날짜는 선택 불가
    const today = new Date();
    const currentMonth = today.getMonth();
    const dateMonth = date.getMonth();
    const currentYear = today.getFullYear();
    const dateYear = date.getFullYear();

    // 월 차이 계산 (연도 고려)
    const monthDiff =
      (dateYear - currentYear) * 12 + (dateMonth - currentMonth);
    if (monthDiff < 0 || monthDiff >= 3) {
      return true;
    }

    // 3. availableDates에 포함되지 않은 날짜는 선택 불가
    return !availableSlots.some(
      (slot) =>
        format(slot.startTime, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  const handelDateSelect = (selectedDate: Date | undefined, field: any) => {
    if (!selectedDate) {
      field.onChange(null);
      setSelectedTimeSlots([]);
      return;
    }
    // 선택한 날짜로 timeSlot 찾기
    const timeSlots = availableSlots.filter(
      (slot) =>
        format(slot.startTime, "yyyy-MM-dd") ===
        format(selectedDate, "yyyy-MM-dd")
    );
    setSelectedTimeSlots(timeSlots);

    if (timeSlots.length > 0) {
      field.onChange(timeSlots[0].slotId);
      const startTimes = timeSlots.map((slot) => slot.startTime);
      setSelectTime(startTimes);
    }
  };

  const formatTime = (isoString: string): string => {
    const date = parseISO(isoString);
    return format(date, "HH:mm", { locale: ko });
  };

  const itemRef = useRef<HTMLDivElement>(null);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        // 에러 발생 시 스크롤
        React.useEffect(() => {
          if (fieldState.error && itemRef.current) {
            itemRef.current.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, [fieldState.error]);

        const selectedDate = selectedTimeSlots[0]?.startTime
          ? new Date(selectedTimeSlots[0].startTime)
          : undefined;
        const selectedSlotInfo = isEditMode
          ? startTime
          : availableSlots.find((slot) => slot.slotId === field.value)
              ?.startTime;
        // RegisterDatePicker.tsx 내부
        const today = new Date();
        const fromMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const toMonth = new Date(today.getFullYear(), today.getMonth() + 3, 0); // 3개월 뒤의 마지막 날

        return (
          <div ref={itemRef}>
            <FormItem className="w-full mb-4 flex flex-col">
              <FormLabel className="text-base text-black font-medium sm:text-lg">
                {title}
              </FormLabel>
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      disabled={isEditMode}
                      variant={"outline"}
                      className={cn(
                        "w-full lg:w-80 md:w-48 pl-3 text-left font-normal bg-white text-xs sm:text-sm text-black ",
                        !field.value && "text-muted-foreground ",
                        isEditMode && "!cursor-not-allowed"
                      )}
                    >
                      {selectedSlotInfo ? (
                        <span className="text-xs sm:text-sm text-black">
                          {format(
                            parseISO(selectedSlotInfo),
                            "yyyy년 MM월 dd일 HH시",
                            { locale: ko }
                          )}
                        </span>
                      ) : (
                        <span className="text-sm font-medium text-gray-500">
                          발표 날짜를 선택하세요
                        </span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="flex flex-row w-auto p-4 bg-neutral-200 rounded-xl shadow-lg border-0 "
                  align="start"
                >
                  <div className="bg-neutral-100 rounded-2xl overflow-hidden ">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => handelDateSelect(date, field)}
                      locale={ko}
                      initialFocus
                      disabled={disabledDays}
                      fromMonth={fromMonth}
                      toMonth={toMonth}
                      className="p-4 w-full"
                      classNames={{
                        months:
                          "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "space-y-4",
                        caption:
                          "flex justify-center pt-1 relative items-center",
                        caption_label: "text-sm font-medium text-gray-900",
                        nav: "space-x-1 flex items-center",
                        nav_button:
                          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 w-7 stroke-black text-black",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell:
                          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                        row: "flex w-full mt-2",
                        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "inline-flex items-center text-black justify-center rounded-md text-sm font-normal ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 aria-selected:opacity-100 h-9 w-9 hover:bg-gray-100",
                        day_selected:
                          "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-600 focus:text-white rounded-full",
                        day_today: "bg-gray-100 text-gray-900 font-semibold",
                        day_outside: "text-muted-foreground opacity-50",
                        day_disabled:
                          "text-muted-foreground  text-gray-700 opacity-50 bg-white cursor-not-allowed",
                        day_range_middle:
                          "aria-selected:bg-accent aria-selected:text-accent-foreground",
                        day_hidden: "invisible",
                      }}
                    />
                  </div>
                  {selectedDate && (
                    <div className="flex flex-col justify-start p-6 border-l border-gray-100 min-w-[200px]">
                      <div className="mb-4 text-center">
                        <h4 className="font-semibold text-base text-gray-900 mb-4">
                          시작 시간
                        </h4>
                      </div>
                      <div className="space-y-3">
                        {selectedTimeSlots.map((slot) => (
                          <div key={slot.slotId} className="flex items-center">
                            <input
                              type="radio"
                              id={`slot-${slot.slotId}`}
                              name="timeSlot"
                              value={slot.slotId.toString()}
                              checked={field.value === slot.slotId}
                              onChange={() => field.onChange(slot.slotId)}
                              className="sr-only"
                            />
                            <Label
                              htmlFor={`slot-${slot.slotId}`}
                              className={cn(
                                "flex items-center justify-center w-full px-4 py-3 text-sm font-medium rounded-xl cursor-pointer border-2 transition-all duration-200",
                                field.value === slot.slotId
                                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                              )}
                            >
                              <Clock className="w-4 h-4 mr-2" />
                              <span>{formatTime(slot.startTime)}</span>
                            </Label>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6">
                        <Button
                          type="button"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors duration-200"
                          onClick={() => {
                            setPopoverOpen(false);
                          }}
                        >
                          완료
                        </Button>
                      </div>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </FormItem>
          </div>
        );
      }}
    />
  );
};

export default RegisterDatePicker;
