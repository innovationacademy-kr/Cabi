import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useRef } from "react";
import { Control } from "react-hook-form";
import {
  PRESENTATION_PERIOD_LABELS,
  PresentationPeriodType,
} from "../types/enum/presentation.type.enum";

interface RegisterTimeSelectProps {
  control: Control<any>;
  name: string;
  title: string;
  isEditMode?: boolean;
}

export const RegisterTimeSelect: React.FC<RegisterTimeSelectProps> = ({
  control,
  title,
  name,
  isEditMode,
}) => {
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

        return (
          <div ref={itemRef}>
            <FormItem>
              <FormLabel className="text-base text-black font-medium sm:text-lg">
                {title}
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger
                    disabled={isEditMode}
                    className="w-full lg:w-80 md:w-48 px-3 py-2 text-xs sm:text-sm text-black border rounded-md bg-white data-[placeholder]:text-gray-500"
                  >
                    <SelectValue placeholder="발표 소요 시간을 선택하세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  {Object.entries(PRESENTATION_PERIOD_LABELS)
                    .filter(([value]) => value !== PresentationPeriodType.NONE)
                    .map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {/* <FormMessage /> */}
            </FormItem>
          </div>
        );
      }}
    />
  );
};
