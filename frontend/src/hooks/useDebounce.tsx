import { useRef } from "react";

const useDebounce = () => {
  const debounceRefs = useRef<{ [key: string]: NodeJS.Timeout | null }>({});

  /**
   * 인자로 주어진 콜백 함수를 디바운스 후 실행시키는 함수.
   * @param {string} key - 함수 식별 키(Ref 동시 참조 방지).
   * @param {Function} callback - 디바운스 후 실행할 함수.
   * @param {number} milliseconds - 디바운스 딜레이 시간.
   */
  const debounce = (
    key: string,
    callback: () => void,
    milliseconds: number
  ) => {
    if (debounceRefs.current[key]) {
      clearTimeout(debounceRefs.current[key]!);
    }
    debounceRefs.current[key] = setTimeout(() => {
      callback();
    }, milliseconds);
  };

  return {
    debounce,
  };
};

export default useDebounce;
