import React from "react";
import { Control } from "react-hook-form";
import { Label } from "@radix-ui/react-label";
import RegisterCheckBox from "./RegisterCheckbox";

interface CheckBoxProps {
  name: string;
  description: string;
  isEditMode?: boolean
}
  interface RegisterCheckboxContainerProps {
    control: Control<any>;
    title: string;
    subtitle: string;
    props: CheckBoxProps[];
}



const RegisterCheckboxContainer: React.FC<RegisterCheckboxContainerProps> = ({control, title, subtitle, props}) => {
  return (
    <div className="w-full">
      <Label className="text-black text-base font-medium sm:text-lg">{title}</Label>
      <div className="w-full rounded-md bg-white mt-2">
        <div className="p-4 text-sm sm:text-bas">
          <Label className="block mb-4 text-gray-600 p-3 text-wrap whitespace-pre-line">{subtitle}</Label> 
          {/* CHECK: whitespace-pre-line 적용이 안됨 */}
            {props.map((checkbox, index) => (
                <RegisterCheckBox
                key={index}
                control={control}
                name={checkbox.name}
                description={checkbox.description}
                isEditMode={checkbox.isEditMode}
                />
            ))}
        </div>
      </div>
    </div>
  );
}

export default RegisterCheckboxContainer;
