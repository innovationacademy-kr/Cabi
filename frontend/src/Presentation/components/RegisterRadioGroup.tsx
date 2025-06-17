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
import { PRESENTATION_CATEGORY_LABELS } from "../types/enum/presentation.type.enum"

interface RegisterRadioGroupProps {
  control: Control<any>;
  name: string;
  title: string;
}

const RegisterRadioGroup: React.FC<RegisterRadioGroupProps> = ({
  control,
  name,
  title,
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
            >
              {Object.entries(PRESENTATION_CATEGORY_LABELS).map(([value, label]) => (
                <div key={value} className="flex items-center ">
                  <RadioGroupItem
                  value={value}
                    id={value}
                    className="sr-only peer"
                  />
                  <Label
                    htmlFor={value}
                    className="lg:w-28 sm:w-24 text-center px-4 py-2 bg-white rounded-lg cursor-pointer border border-gray-200 
                                hover:bg-blue-50 transition-colors
                                peer-data-[state=checked]:bg-blue-600 
                                peer-data-[state=checked]:text-white 
                                peer-data-[state=checked]:border-blue-600"
                  >
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RegisterRadioGroup;
