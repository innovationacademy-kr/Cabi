import { useState } from "react";

const useInput = (
  initialValue: string = "",
  maxLength: number
): [
  string,
  (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void
] => {
  const [value, setValue] = useState<string>(initialValue);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const data = e.target.value.slice(0, maxLength);
    setValue(data);
  };

  return [value, onChange];
};

export default useInput;
