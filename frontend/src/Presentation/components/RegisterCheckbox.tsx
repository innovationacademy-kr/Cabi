import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Control } from "react-hook-form";
import { RegisterType } from "../types/enum/presentation.type.enum";

interface RegisterCheckBoxProps {
  control: Control<any>;
  name: string;
  subtitle: string;
  description: string;
  isEdit: boolean;
}
const RegisterCheckBox: React.FC<RegisterCheckBoxProps> = ({
  control,
  name,
  subtitle,
  description,
  isEdit,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div>
          <FormItem className="flex flex-row items-center  space-x-3 space-y-0 rounded-md border p-2">
            <FormControl>
              <Checkbox
                checked={field.value || false}
                onCheckedChange={
                  isEdit
                    ? undefined
                    : (checked) => field.onChange(checked === true)
                }
                className={cn(
                  "h-5 w-5 border-gray-300",
                  isEdit && "cursor-not-allowed opacity-60 "
                )}
              />
            </FormControl>
            <FormMessage />
            <div className="space-y-1 leading-none ">
              <FormLabel
                className={cn(
                  "text-black text-sm sm:text-base",
                  isEdit && "opacity-40"
                )}
              >
                {description}
              </FormLabel>
            </div>
          </FormItem>
          <div className="bg-red">
            <p className="block mb-4 text-gray-600 px-3 text-wrap whitespace-pre-line">
              {subtitle}
            </p>
          </div>
        </div>
      )}
    />
  );
};

export default RegisterCheckBox;
