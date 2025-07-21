import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React from "react";
import { Control } from "react-hook-form";
import { PRESENTATION_CATEGORY_LABELS } from "../types/enum/presentation.type.enum";

interface RegisterRadioGroupProps {
  control: Control<any>;
  name: string;
  title: string;
  isEditMode?: boolean;
}

const RegisterRadioGroup: React.FC<RegisterRadioGroupProps> = ({
  control,
  name,
  title,
  isEditMode,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full space-y-3">
          <FormLabel className="text-base font-medium">{title}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-wrap gap-3"
              disabled={isEditMode}
            >
              {Object.entries(PRESENTATION_CATEGORY_LABELS).map(
                ([value, label]) => (
                  <div key={value} className="flex items-center ">
                    <RadioGroupItem
                      value={value}
                      id={value}
                      className="sr-only peer"
                    />
                    <Label
                      htmlFor={value}
                      className="lg:w-28 sm:w-24 text-center px-4 py-2 bg-[#ffffff] text-black rounded-lg cursor-pointer border border-[#e5e5e5]
                                hover:bg-[#e0edff] transition-colors
                                peer-data-[state=checked]:bg-[#2563eb]
                                peer-data-[state=checked]:text-[#ffffff]
                                peer-data-[state=checked]:border-[#2563eb]"
                    >
                      {label}
                    </Label>
                  </div>
                )
              )}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RegisterRadioGroup;
