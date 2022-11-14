import { useCallback, useState } from "react";

const useInput = (
  initialState: object
): [
  any,
  React.Dispatch<React.SetStateAction<object>>,
  (e: React.ChangeEvent<HTMLInputElement>) => void,
  () => void
] => {
  const [input, setInput] = useState(initialState);
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((input) => ({ ...input, [name]: value }));
  }, []);
  const reset = useCallback(() => setInput(initialState), [initialState]);
  return [input, setInput, onChange, reset];
};

export default useInput;
