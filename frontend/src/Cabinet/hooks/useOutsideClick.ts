import { RefObject, useEffect } from "react";

type CallbackFunction = () => void;

const useOutsideClick = (
  ref: RefObject<HTMLElement>,
  callback: CallbackFunction
) => {
  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};

export default useOutsideClick;
