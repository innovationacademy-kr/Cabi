import { useState } from "react";

export interface IValidationResult {
  isValid: boolean;
  message: string;
}

const useInput = (
  initialValue: string = "",
  maxLength: number,
  validation?: (value: string) => IValidationResult
): [
  string,
  (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void,
  string
] => {
  const [value, setValue] = useState<string>(initialValue);
  const [error, setError] = useState<string>("");

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const data = e.target.value.slice(0, maxLength);
    setValue(data);
    if (validation) {
      const result: IValidationResult = validation(data);
      setError(result.isValid ? "" : result.message);
    }
  };

  return [value, onChange, error];
};

export default useInput;
