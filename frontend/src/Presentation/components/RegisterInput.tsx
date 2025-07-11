import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, useFormContext } from "react-hook-form";

interface RegisterInputProps {
  control: Control<any>;
  name: string;
  title: string;
  maxLength: number;
  placeholder: string;
  isEditMode?: boolean;
}

const RegisterInput: React.FC<RegisterInputProps> = ({ control, name, title, maxLength, placeholder, isEditMode }) => {
  const { watch } = useFormContext();
  const value = watch(name);
  const textCounter = value?.length || 0;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full mb-4">
          <FormLabel className="text-base text-black font-medium sm:text-lg">{title}</FormLabel> 
          <FormControl>
            <Input
              disabled={isEditMode}
              placeholder={placeholder}
              {...field}
              maxLength={maxLength}
              className="bg-white text-black w-full px-3 py-2 text-sm sm:text-base text-black border rounded-md" 
            />
          </FormControl>
          <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-1">
            <span>
              <FormMessage />
            </span>
            <span className={textCounter > maxLength ? "text-red-500" : ""}>
              {textCounter}/{maxLength}
            </span>
          </div>
        </FormItem>
      )}
    />
  );
};

export default RegisterInput;

