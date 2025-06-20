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
import { Control} from "react-hook-form";
import { PRESENTATION_PERIOD_LABELS, PresentationPeriodType } from "../types/enum/presentation.type.enum";


interface RegisterTimeSelectProps {
  control: Control<any>;
  name: string;
  title: string;
}

export const RegisterTimeSelect: React.FC<RegisterTimeSelectProps> = ({
  control,
  title,
  name,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base text-black font-medium sm:text-lg">
            {title}
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="w-full lg:w-80 md:w-48 px-3 py-2 text-sm sm:text-base border rounded-md">
                <SelectValue placeholder="Select a verified email to display" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Object.entries(PRESENTATION_PERIOD_LABELS).filter(([value]) => value !== PresentationPeriodType.NONE).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* <FormMessage /> */}
        </FormItem>
      )}
    />
  );
};
