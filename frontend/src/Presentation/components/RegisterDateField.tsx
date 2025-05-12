// form-fields/DateTimeFields.jsx
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Control } from "react-hook-form";

interface RegisterDateTimeFieldsProps {
  control: Control<any>;
}

const RegisterDateTimeField: React.FC<RegisterDateTimeFieldsProps> = ({ control }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={control}
            name="date"
            rules={{ required: "날짜를 선택해주세요" }}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>날짜</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant="outline"
                        className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                        )}
                        >
                        {field.value ? (
                            format(field.value, "PPP", { locale: ko })
                        ) : (
                            <span>날짜 선택</span>
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
                    />
                    </PopoverContent>
                </Popover>
                <FormMessage />
                </FormItem>
            )}
            />
            
            <FormField
            control={control}
            name="time"
            rules={{ required: "시간을 입력해주세요" }}
            render={({ field }) => (
                <FormItem>
                <FormLabel>시간</FormLabel>
                <FormControl>
                    <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        );
    }
export default RegisterDateTimeField;