import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import { Control, useFormContext } from "react-hook-form";

interface RegisterTextareaProps {
  control: Control<any>;
  name: string;
  title: string;
  maxLength: number;
  placeholder: string;
  rows: number;
  isEditMode?: boolean; // 추가
}

const RegisterTextarea: React.FC<RegisterTextareaProps> = ({
  control,
  name,
  title,
  maxLength,
  placeholder,
  rows,
  isEditMode = false, // 기본값 false
}) => {
  const { watch } = useFormContext();
  const value = watch(name);
  const textCounter = value?.length || 0;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full mb-4">
          <FormLabel className=" text-black text-base font-medium sm:text-lg">
            {title}
          </FormLabel>
          <FormControl>
            <textarea
              className="w-full box-border rounded-md border-0 bg-white px-3 py-2 text-sm text-base resize-y transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              rows={rows}
              placeholder={placeholder}
              maxLength={maxLength}
              disabled={isEditMode} // 여기 추가
              {...field}
            />
          </FormControl>
          <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-1">
            <span>{/* <FormMessage /> */}</span>
            <span className={textCounter > maxLength ? "text-red-500" : ""}>
              {textCounter}/{maxLength}
            </span>
          </div>
        </FormItem>
      )}
    />
  );
};

export default RegisterTextarea;

// import React from "react";
// import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Control, useFormContext, UseFormRegisterReturn } from "react-hook-form";

// interface RegisterTextareaProps {
//     control: Control<any>
//     name: string;
//     title: string;
//     maxLength: number;
//     placeholder: string;
//     rows: number;
// }

// const RegisterTextarea: React.FC<RegisterTextareaProps> = ({  control, name, title, maxLength, placeholder, rows }) => {

//     const { watch } = useFormContext();
//     const value = watch(name);
//     const textCounter = value?.length || 0;

//     return (
//         <FormField
//             control={control}
//             name={name}
//             render={ ({ field }) => (
//                 <FormItem >
//                 <FormLabel className="text-lg font-bold">{title}</FormLabel>
//                 <FormControl>
//                 <textarea
//                     className="flex w-[696px] rounded-md border-0 bg-white px-3 py-1 text-sm resize-y text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-left"
//                     rows={rows}
//                     placeholder={placeholder}
//                     maxLength={maxLength}
//                     {...field}
//                         />
//                 </FormControl>
//                 <div className="flex justify-between text-xs text-gray-500">
//                     <span>
//                     {/* <FormMessage /> */}
//                     </span>
//                     <span className={textCounter > maxLength ? "text-red-500" : ""}>
//                     {textCounter}/{maxLength}
//                     </span>
//                 </div>
//                 </FormItem>
//             )}
//         />
//     );
// };

// export default RegisterTextarea;
