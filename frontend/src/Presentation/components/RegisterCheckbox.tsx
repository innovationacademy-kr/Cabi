import React from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

  interface RegisterCheckboxProps {
    control: Control<any>;
    title: string;
}

import { Check } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { ConsentType } from "./RegisterForm";
const RegisterCheckbox: React.FC<RegisterCheckboxProps> = ({control, title,}) => {

    return (
    <div className="w-full">
      <Label className="text-black text-base font-medium sm:text-lg">{title}</Label>
        <div className="w-full rounded-md bg-white mt-2">
          <div className="p-4 text-sm sm:text-bas">
          {/* <div className="p-4 text-center text-sm sm:text-bas"> */}
            <Label className="block mb-4 text-gray-600 p-3 text-wrap">본 영상 촬영 서비스를 신청하시면, 촬영된 영상은 향후 서비스 이용자들을 위한 다시보기 콘텐츠로 제공됩니다.<br/>
            다음 항목에 대해 각각의 동의 여부를 선택해주세요.</Label>
          <FormField
            control={control}
            name={ConsentType.RECORDING}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center  space-x-3 space-y-0 rounded-md border p-2">
                <FormControl>
                <Checkbox
                  checked={field.value || false} // React Hook Form의 value와 연결
                  onCheckedChange={(checked) => field.onChange(checked)} 
                  className="h-5 w-5"
                  />
                </FormControl>
                <FormMessage />
                <div className="space-y-1 leading-none ">
                    <FormLabel className="text-black text-sm sm:text-base ">
                    촬영된 영상의 다시보기 제공에 동의합니다.
                    </FormLabel>
                </div>
              </FormItem>
            )}
            />
            <FormField
            control={control}
            name={ConsentType.PUBLISHING}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-2">
                <FormControl>
                <Checkbox
                  checked={field.value || false} // React Hook Form의 value와 연결
                  onCheckedChange={(checked) => field.onChange(checked)}
                  className="h-5 w-5"
                  />
                </FormControl>
                <FormMessage />
                <div className="space-y-1 leading-none">
                    <FormLabel className="text-black text-sm sm:text-base">
                    촬영된 영상 및 관련 게시물을 본 기관(42 Seoul) 외부 플랫폼 및 채널에 공개하는 것에 동의합니다.
                    </FormLabel>
                    {/* <FormDescription>
                      url{" "}
                    </FormDescription> */}
                  </div>
              </FormItem>
            )}
            />
          </div>
          </div>
        </div>
    );
};

export default RegisterCheckbox;