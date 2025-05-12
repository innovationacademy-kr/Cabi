
import * as React from "react"
import { format } from "date-fns"
import { ko } from "date-fns/locale";
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Control } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"

interface RegisterDatePickerProps {
    control: Control<any>;
    name: string;
    title: string;
}

const RegisterDatePicker: React.FC<RegisterDatePickerProps> = ({control, title, name}) => {
    return (
        <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem className="w-full mb-4 flex flex-col">
                <FormLabel className="text-base text-black font-medium sm:text-lg">{title}</FormLabel> 
                <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full lg:w-80 md:w-48 pl-3 text-left font-normal bg-white text-xs sm:text-sm text-black",
                                !field.value && "text-muted-foreground "
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP", {locale: ko})
                            ) : (
                                <span className=" text-xs sm:text-sm text-gray-500" >발표 날짜를 선택하세요</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>                      
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            locale={ko}
                            initialFocus
                            // disabled={(date) =>
                            // date > new Date() || date < new Date("1900-01-01")}  // 불가능 날짜 지정
                        />
                    </PopoverContent>                    
                </Popover>
            </FormItem>
            
            )}
        />
    )
}

export default RegisterDatePicker;


// import React, { useEffect, useState } from "react";
// import { format, parseISO } from "date-fns";
// import { ko } from "date-fns/locale";
// import { Clock } from "lucide-react";
// import {
// FormControl,
// FormField,
// FormItem,
// FormLabel,
// FormMessage,
// } from "@/components/ui/form";
// // import { Button } from "@/components/ui/button";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Control } from "react-hook-form";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { TimeSlot, fetchAvailableSlots } from "@/api";

//     interface GroupedSlots {
//     [date: string]: TimeSlot[];
//     }

//     interface AvailableSlotsPickerProps {
//     control: Control<any>;
//     }

//     const AvailableSlotsPicker: React.FC<AvailableSlotsPickerProps> = ({ control }) => {
//     const [isLoading, setIsLoading] = useState(true);
//     const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
//     const [groupedSlots, setGroupedSlots] = useState<GroupedSlots>({});
//     const [selectedDate, setSelectedDate] = useState<string | null>(null);
//     const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
//     const [error, setError] = useState<string | null>(null);

//     // Function to fetch available slots from API
//     const getAvailableSlots = async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//         const data = await fetchAvailableSlots();
//         setAvailableSlots(data.results);
        
//         // Group slots by date
//         const grouped = groupSlotsByDate(data.results);
//         setGroupedSlots(grouped);
        
//         // Set first date as selected if available
//         const dates = Object.keys(grouped);
//         if (dates.length > 0) {
//         setSelectedDate(dates[0]);
//         }
//     } catch (error) {
//         console.error("Failed to fetch available slots:", error);
//         setError("일정을 불러오는데 실패했습니다. 다시 시도해주세요.");
//     } finally {
//         setIsLoading(false);
//     }
//     };

//     // Fetch available slots on component mount
//     useEffect(() => {
//     getAvailableSlots();
//     }, []);

//     // Group slots by date
//     const groupSlotsByDate = (slots: TimeSlot[]): GroupedSlots => {
//     return slots.reduce((acc: GroupedSlots, slot) => {
//         const date = slot.startTime.split('T')[0]; // Extract date part
//         if (!acc[date]) {
//         acc[date] = [];
//         }
//         acc[date].push(slot);
//         return acc;
//     }, {});
//     };

//     // Format time from ISO string
//     const formatTime = (isoString: string): string => {
//     const date = parseISO(isoString);
//     return format(date, 'HH:mm', { locale: ko });
//     };

//     // Get day of week
//     const getDayOfWeek = (dateString: string): string => {
//     const date = parseISO(dateString);
//     return format(date, 'EEE', { locale: ko });
//     };

//     return (
//     <FormField
//         control={control}
//         name="selectedSlot"
//         render={({ field }) => (
//         <FormItem className="w-full">
//             <FormLabel>발표 일정 선택</FormLabel>
//             <FormControl>
//             <div className="border rounded-md p-2">
//                 {isLoading ? (
//                 <div className="flex justify-center items-center h-40">
//                     <div className="flex flex-col items-center gap-2">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//                     <span>일정을 불러오는 중...</span>
//                     </div>
//                 </div>
//                 ) : error ? (
//                 <div className="flex flex-col justify-center items-center h-40 text-destructive">
//                     <p>{error}</p>
//                     <Button 
//                     variant="outline" 
//                     className="mt-4"
//                     onClick={() => {
//                         setIsLoading(true);
//                         setError(null);
//                         // Re-fetch available slots
//                         getAvailableSlots();
//                     }}
//                     >
//                     다시 시도
//                     </Button>
//                 </div>
//                 ) : Object.keys(groupedSlots).length === 0 ? (
//                 <div className="flex justify-center items-center h-40">
//                     <p className="text-muted-foreground">현재 예약 가능한 발표 일정이 없습니다.</p>
//                 </div>
//                 ) : (
//                 <div className="space-y-4">
//                     <Tabs 
//                     defaultValue={selectedDate || undefined}
//                     onValueChange={(value) => setSelectedDate(value)}
//                     className="w-full"
//                     >
//                     <ScrollArea className="w-full whitespace-nowrap">
//                         <TabsList className="w-full justify-start">
//                         {Object.keys(groupedSlots).map((date) => (
//                             <TabsTrigger key={date} value={date} className="min-w-24">
//                             <div className="flex flex-col items-center">
//                                 <span>{format(parseISO(date), 'd', { locale: ko })}</span>
//                                 <span className="text-xs">{getDayOfWeek(date)}</span>
//                             </div>
//                             </TabsTrigger>
//                         ))}
//                         </TabsList>
//                     </ScrollArea>
                    
//                     {Object.entries(groupedSlots).map(([date, slots]) => (
//                         <TabsContent key={date} value={date} className="mt-4">
//                         <div className="mb-2">
//                             <span className="font-medium">
//                             {format(parseISO(date), 'yyyy년 MM월 dd일', { locale: ko })} ({getDayOfWeek(date)})
//                             </span>
//                         </div>
//                         <RadioGroup
//                             value={field.value?.slot_id?.toString()}
//                             onValueChange={(value) => {
//                             const selectedSlot = availableSlots.find(
//                                 (slot) => slot.slot_id.toString() === value
//                             );
//                             if (selectedSlot) {
//                                 field.onChange(selectedSlot);
//                                 setSelectedSlotId(parseInt(value));
//                             }
//                             }}
//                             className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
//                         >
//                             {slots.map((slot) => (
//                             <div key={slot.slot_id} className="flex">
//                                 <RadioGroupItem
//                                 value={slot.slot_id.toString()}
//                                 id={`slot-${slot.slot_id}`}
//                                 className="peer sr-only"
//                                 />
//                                 <label
//                                 htmlFor={`slot-${slot.slot_id}`}
//                                 className="flex items-center justify-center gap-2 w-full p-2 border rounded-md 
//                                         cursor-pointer hover:bg-gray-100 peer-checked:border-primary peer-checked:bg-primary/10"
//                                 >
//                                 <Clock className="h-4 w-4" />
//                                 <span>{formatTime(slot.startTime)}</span>
//                                 </label>
//                             </div>
//                             ))}
//                         </RadioGroup>
                        
//                         {field.value && (
//                             <div className="mt-4 p-2 bg-primary/10 rounded-md">
//                             <p className="text-sm">
//                                 선택한 발표 일정: {format(parseISO(field.value.startTime), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}
//                             </p>
//                             </div>
//                         )}
//                         </TabsContent>
//                     ))}
//                     </Tabs>
//                 </div>
//                 )}
//             </div>
//             </FormControl>
//             <FormMessage />
//         </FormItem>
//         )}
//     />
//     );
//     };

// export default AvailableSlotsPicker;