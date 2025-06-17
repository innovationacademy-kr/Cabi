import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Control } from "react-hook-form";


interface RegisterCheckBoxProps {
    control: Control<any>;
    name: string;
    description: string;
}
const RegisterCheckBox: React.FC<RegisterCheckBoxProps> = ({control, name, description}) => {
    return (
        <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem className="flex flex-row items-center  space-x-3 space-y-0 rounded-md border p-2">
                <FormControl>
                <Checkbox
                checked={field.value || false} 
                onCheckedChange={(checked) => field.onChange(checked)} 
                className="h-5 w-5 border-gray-300 "
                />
                </FormControl>
                <FormMessage />
                <div className="space-y-1 leading-none ">
                    <FormLabel className="text-black text-sm sm:text-base ">
                    {description}
                    </FormLabel>
                </div>
            </FormItem>
        )}
        />
    );
}

export default RegisterCheckBox;
